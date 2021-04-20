import { Injectable } from '@angular/core';
import { ForceDirectedGraph } from './models/force-directed-graph';
import { Node } from './models/node';
import { Link } from './models/link';
import { D3DragEvent, D3ZoomEvent, drag, select, zoom } from 'd3';

type ZoomEvent = D3ZoomEvent<Element, unknown>;

type DragEvent = D3DragEvent<Element, unknown, unknown>;
type StartedDragEvent = D3DragEvent<Element, DragEvent, unknown>;

@Injectable()
export class D3GraphService {
  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement: Element, containerElement: Element): void {


    const svg = select<Element, ZoomEvent>(svgElement);
    const container = select(containerElement);

    const zoomed = (event: ZoomEvent): void => {
      const transform = event.transform;
      container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
    };

    const zoomBehavior = zoom<Element, ZoomEvent>()
      .on('zoom', zoomed);

    svg.call(zoomBehavior);
  }

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour(element: Element, node: Node, graph: ForceDirectedGraph): void {
    const d3element = select<Element, StartedDragEvent>(element);

    function started(startedEvent: StartedDragEvent): void {
      /** Preventing propagation of dragstart to parent elements */
      startedEvent.sourceEvent.stopPropagation();

      if (!startedEvent.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      startedEvent
        .on('drag', dragged)
        .on('end', ended);

      function dragged(event: DragEvent): void {
        node.fx = event.x;
        node.fy = event.y;
      }

      function ended(event: DragEvent): void {
        if (!event.active) {
          graph.simulation.alphaTarget(0);
        }

        node.fx = null;
        node.fy = null;
      }
    }

    const a = drag<Element, StartedDragEvent>()
      .on('start', started);

    d3element.call(a);
  }

  /** The interactable graph we will simulate in this article
   * This method does not interact with the document, purely physical calculations with d3
   */
  getForceDirectedGraph(nodes: Node[], links: Link[], options: { width: number, height: number }): ForceDirectedGraph {
    return new ForceDirectedGraph(nodes, links, options);
  }
}
