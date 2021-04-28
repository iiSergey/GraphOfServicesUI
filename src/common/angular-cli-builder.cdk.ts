import * as os from 'os';
import * as path from 'path';
import { ISource, Source } from '@aws-cdk/aws-s3-deployment';
import { AssetStaging, BundlingOptions, DockerImage, ILocalBundling } from '@aws-cdk/core';
import { getNpxVersion, getAngularCliVersion, exec } from './util.cdk';

const NPX_MAJOR_VERSION = '6';
export interface AngularCliBuildProps {

  // Angular source directory
  readonly source: string;

  // Angular-cli environments
  readonly environment?: { [ key: string ]: string };

  readonly bundlingArguments?: string;

  // Runs Angular-cli locally
  readonly runsLocally?: boolean;

  // Force use docker to bundling
  readonly forceDockerBundling?: boolean;
}

export class AngularCliBundling implements BundlingOptions {

  public static bundling(options: AngularCliBuildProps): ISource {
    return Source.asset(
      options.source,
      {
        bundling: new AngularCliBundling(options),
      },
    );
  }

  private static runsLocally?: boolean | true

  public readonly image: DockerImage

  public readonly command?: string[] | undefined

  public readonly environment?: { [key: string]: string } | {}

  public readonly bundlingArguments?: string | ''

  public readonly local?: ILocalBundling | undefined

  constructor(props: AngularCliBuildProps) {
    AngularCliBundling.runsLocally = (getNpxVersion()?.startsWith(NPX_MAJOR_VERSION) && getAngularCliVersion()?.startsWith('@angular/cli')) ?? false;
    const bundlingArguments = props.bundlingArguments ?? '';
    const bundlingCommand = AngularCliBundling.createBundlingCommand(AssetStaging.BUNDLING_OUTPUT_DIR, bundlingArguments);
    this.image = DockerImage.fromRegistry('node:lts');
    this.command = ['bash', '-c', bundlingCommand];
    this.environment = props.environment;
    if (!props.forceDockerBundling) {
      const osPlatform = os.platform();
      const createLocalCommand = (outputDir: string) => {
        return AngularCliBundling.createBundlingCommand(outputDir, bundlingArguments, osPlatform);
      };
      this.local = {
        tryBundle(outputDir: string) {
          if (AngularCliBundling.runsLocally === false) {
            process.stderr.write('Angular cli cannot run locally. Switching to Docker bundling.\n');
            return false;
          }
          try {
            exec(
              osPlatform === 'win32' ? 'cmd' : 'bash',
              [
                osPlatform === 'win32' ? '/c' : '-c',
                createLocalCommand(outputDir),
              ],
              {
                env: {
                  ...process.env,
                  ...props.environment,
                },
                stdio: [
                  'ignore',
                  process.stderr,
                  'inherit',
                ],
                cwd: path.resolve(props.source),
                windowsVerbatimArguments: osPlatform === 'win32',
              },
            );
          } catch (error) {
            return false;
          }
          return true;
        },
      };
    }
  }

  private static createBundlingCommand(outputDir: string, bundlingArguments: string, osPlatform: NodeJS.Platform = 'linux'): string {
    const npx = osPlatform === 'win32' ? 'npx.cmd' : 'npx';
    const angularCliServeBuildCommand: string[] = [
      npx,
      'npm',
      'install',
      ';',
      npx,
      'ng',
      'build',
      bundlingArguments,
      '--no-install',
      '--no-clean',
      `--dest ${outputDir}`,
    ];
    return angularCliServeBuildCommand.join(' ');
  }
}
