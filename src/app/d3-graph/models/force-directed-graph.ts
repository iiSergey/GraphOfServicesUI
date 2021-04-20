import { EventEmitter } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import { ForceDirectedGraphSetting } from '../d3-graph.config';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, Simulation } from 'd3';

export class ForceDirectedGraph {
  public ticker: EventEmitter<Simulation<Node, Link>> = new EventEmitter();
  public simulation: Simulation<Node, Link>;

  public nodes: Node[] = [];
  public links: Link[] = [];

  constructor(nodes: Node[], links: Link[], options: { width: number, height: number }) {
    this.nodes = nodes;
    this.links = links;

    this.simulation = this.initSimulation();

    this.initNodes();
    this.initLinks();

    this.refreshSimulation(options);
  }

  connectNodes(source: number, target: number): void {
    let link;

    if (!this.nodes[source] || !this.nodes[target]) {
      throw new Error('One of the nodes does not exist');
    }

    link = new Link(this.nodes[source], this.nodes[target]);
    this.simulation.stop();
    this.links.push(link);
    this.simulation.alphaTarget(0.3).restart();

    this.initLinks();
  }

  private initNodes(): void {
    if (!this.simulation) {
      throw new Error('simulation was not initialized yet');
    }
    this.simulation.nodes(this.nodes);
  }

  private initLinks(): void {
    if (!this.simulation) {
      throw new Error('simulation was not initialized yet');
    }

    this.simulation.force('links',
      forceLink<Node, Link>(this.links)
        .id(l => l.id)
        .strength(ForceDirectedGraphSetting.LINKS)
    );
  }

  refreshSimulation(options: { width: number, height: number }): void {
    if (!options || !options.width || !options.height) {
      throw new Error('missing options when initializing simulation');
    }

    /** Updating the central force of the simulation */
    this.simulation.force('centers', forceCenter(options.width / 2, options.height / 2));

    /** Restarting the simulation internal timer */
    this.simulation.restart();
  }

  private initSimulation(): d3.Simulation<Node, Link> {


    const ticker = this.ticker;

    const simulation = forceSimulation<Node, Link>()
      .force('charge',
        forceManyBody<Node>()
          .strength((d) => ForceDirectedGraphSetting.CHARGE * d.r)
      )
      .force('collide',
        forceCollide<Node>()
          .strength(ForceDirectedGraphSetting.COLLISION)
          .radius((d) => d.r + ForceDirectedGraphSetting.DISTANCE).iterations(2)
      );

    // Connecting the d3 ticker to an angular event emitter
    simulation.on('tick', () => {
      ticker.emit(simulation);
    });

    return simulation;
  }
}
