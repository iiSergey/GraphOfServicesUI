import { Component, Input } from '@angular/core';
import { Node } from '../../models/node';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[appNodeVisual]',
  template: `
    <svg:g [attr.transform]="'translate(' + appNodeVisual.x + ',' + appNodeVisual.y + ')'">
      <svg:circle
        class="node"
        [attr.fill]="appNodeVisual.color"
        cx="0"
        cy="0"
        [attr.r]="appNodeVisual.r">
      </svg:circle>
      <svg:text
        class="node-name"
        [attr.font-size]="appNodeVisual.fontSize">
        {{appNodeVisual.id}}
      </svg:text>
    </svg:g>
  `,
  styleUrls: ['./node-visual.component.scss']
})
export class NodeVisualComponent {
  @Input() appNodeVisual: Node;
}
