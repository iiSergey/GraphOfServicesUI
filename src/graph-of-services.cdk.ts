import { Aws, CfnOutput, Construct, Duration } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { HttpsRedirect } from '@aws-cdk/aws-route53-patterns';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  SecurityPolicyProtocol,
  SSLMethod,
  ViewerCertificate,
} from '@aws-cdk/aws-cloudfront';
import { BucketDeployment } from '@aws-cdk/aws-s3-deployment';
import { AngularCliBuildProps, AngularCliBundling } from './common/angular-cli-builder.cdk';


export interface StaticSiteProps extends AngularCliBuildProps {
  readonly domainName: string;
  readonly source: string;
  readonly siteSubDomain?: string;
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class GraphOfServices extends Construct {
  constructor(parent: Construct, id: string, props: StaticSiteProps) {
    super(parent, id);


    const bucketId = `${id}-bucket`;
    const bucket = new Bucket(this, bucketId, {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html'
    });

    const accessIdentityId = `${id}-origin-access-identity`;
    const originAccessIdentity = new OriginAccessIdentity(this, accessIdentityId, { comment: Aws.STACK_NAME, });
    bucket.grantRead(originAccessIdentity);

    const siteSubDomain = props.siteSubDomain?.replace(/^\//, '') ?? 'app';
    const domainName = `${props.domainName}`;
    const redirectDomainName = `${siteSubDomain}.${props.domainName}`;

    const HostedZoneId = `${id}-hosted-zone`;
    const zone = HostedZone.fromLookup(this, HostedZoneId, {
      domainName: props.domainName,
    });
    new CfnOutput(this, 'Site', { value: 'https://' + domainName });

    const dnsCertificate = `${id}-dns-certificate`;
    const certificate =
      new DnsValidatedCertificate(this, dnsCertificate, {
        hostedZone: zone,
        domainName,
        region: 'us-east-1',
        subjectAlternativeNames: ['*.' + props.domainName],
      });
    const certificateArn = certificate.certificateArn;
    new CfnOutput(this, 'DnsCertificate', { value: certificateArn });

    const cloudFrontDistribution = `${id}-cloud-front-distribution`;
    const distribution = new CloudFrontWebDistribution(this, cloudFrontDistribution, {
      aliasConfiguration: {
        acmCertRef: certificateArn,
        names: [domainName],
        sslMethod: SSLMethod.SNI,
        securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2019,
      },
      viewerCertificate: ViewerCertificate.fromAcmCertificate(
        certificate,
        {
          aliases: ['example.com', 'www.example.com'],
          securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2019,
          sslMethod: SSLMethod.SNI
        },
      ),
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
          connectionAttempts: 3,
          connectionTimeout: Duration.seconds(10),
        },
      ],
      errorConfigurations: [{
        errorCode: 403,
        responsePagePath: '/index.html',
        responseCode: 200
      },
        {
          errorCode: 404,
          responsePagePath: '/index.html',
          responseCode: 200
        }],
    });
    new CfnOutput(this, cloudFrontDistribution, { value: distribution.distributionId });

    const aRecordId = `${id}-alias-record`;
    new ARecord(this, aRecordId, {
      recordName: domainName,
      zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    const httpsRedirectId = `${id}-https-redirect`;
    new HttpsRedirect(this, httpsRedirectId, {
      zone,
      recordNames: [redirectDomainName],
      targetDomain: domainName,
    });

    const s3SourceAsset = AngularCliBundling.bundling({
      source: props.source,
      runsLocally: props.runsLocally ?? true,
      forceDockerBundling: props.forceDockerBundling ?? false,
      bundlingArguments: props.bundlingArguments,
      environment: props.environment,
    });

    const bucketDeploymentId = `${id}-cloud-front-distribution`;
    new BucketDeployment(this, bucketDeploymentId, {
      sources: [
        s3SourceAsset
      ],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
