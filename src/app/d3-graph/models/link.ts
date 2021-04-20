import { Node } from './node';
import * as d3 from 'd3';

export class Link implements d3.SimulationLinkDatum<Node> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;

  // must - defining enforced implementation properties
  source: Node;
  target: Node;

  constructor(source: Node, target: Node) {
    this.source = source;
    this.target = target;
  }
}
