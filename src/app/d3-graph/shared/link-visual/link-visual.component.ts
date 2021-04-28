import { Component, Input } from '@angular/core';
import { Link } from '../../models/link';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[appLinkVisual]',
  template: `
    <svg:line
      class="link"
      [attr.x1]="appLinkVisual.source.x"
      [attr.y1]="appLinkVisual.source.y"
      [attr.x2]="appLinkVisual.target.x"
      [attr.y2]="appLinkVisual.target.y"
    />
  `,
  styleUrls: ['./link-visual.component.less']
})
export class LinkVisualComponent {
  @Input() appLinkVisual!: Link;
}
