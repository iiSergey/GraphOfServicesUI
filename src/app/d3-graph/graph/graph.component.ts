import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit
} from '@angular/core';
import { ForceDirectedGraph } from '../models/force-directed-graph';
import { D3GraphService } from '../d3-graph.service';

@Component({
  selector: 'app-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="options.width" [attr.height]="options.height">
      <g [appZoomableOf]="svg">
        <g [appLinkVisual]="link" *ngFor="let link of links"></g>
        <g [appNodeVisual]="node" *ngFor="let node of nodes"
           [appDraggableNode]="node" [appDraggableInGraph]="graph"></g>
      </g>
    </svg>
  `,
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit {
  @Input() nodes;
  @Input() links;
  graph: ForceDirectedGraph;
  private graphOptions: { width, height } = { width: 800, height: 600 };

  constructor(private d3GraphService: D3GraphService, private ref: ChangeDetectorRef) {
  }

  get options() {
    return this.graphOptions = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3GraphService.getForceDirectedGraph(this.nodes, this.links, this.options);

    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }
}
