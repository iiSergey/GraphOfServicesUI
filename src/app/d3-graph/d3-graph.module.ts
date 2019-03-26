import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { D3GraphService } from './d3-graph.service';
import { GraphComponent } from './graph/graph.component';
import { LinkVisualComponent } from './shared/link-visual/link-visual.component';
import { NodeVisualComponent } from './shared/node-visual/node-visual.component';
import { DraggableNodeDirective } from './directives/draggable-node.directive';
import { ZoomableOfDirective } from './directives/zoomable-of.directive';

@NgModule({
  declarations: [
    GraphComponent,
    LinkVisualComponent,
    NodeVisualComponent,
    DraggableNodeDirective,
    ZoomableOfDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
    D3GraphService
  ]
})
export class D3GraphModule {
}
