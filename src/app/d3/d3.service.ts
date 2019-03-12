import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Link } from './model/link';
import { Node } from './model/node';
import { ForceDirectedGraph } from './model/force-directed-graph';

@Injectable({
  providedIn: 'root'
})
export class D3Service {
  /** This service will provide methods to enable user interaction with elements
  * while maintaining the d3 simulations physics
  */
  constructor() { }

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour() { }

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour() { }

  getForceDirectedGraph(nodes: Node[], links: Link[], options: { width, height }) {
    let graph = new ForceDirectedGraph(nodes, links, options);
    return graph;
  }
}
