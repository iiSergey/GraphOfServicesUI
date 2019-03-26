import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Node } from '../models/node';
import { ForceDirectedGraph } from '../models/force-directed-graph';
import { D3GraphService } from '../d3-graph.service';

@Directive({
  selector: '[appDraggableNode]'
})
export class DraggableNodeDirective implements OnInit {
  @Input() appDraggableNode: Node;
  @Input() appDraggableInGraph: ForceDirectedGraph;

  constructor(private d3Service: D3GraphService, private elementOfDraggable: ElementRef) {
  }

  ngOnInit() {
    this.d3Service.applyDraggableBehaviour(this.elementOfDraggable.nativeElement, this.appDraggableNode, this.appDraggableInGraph);
  }
}
