import { Component } from '@angular/core';
import { Link } from './d3-graph/models/link';
import { Node } from './d3-graph/models/node';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'GraphOfServices';
  links: Link[];
  nodes: Node[];

  constructor() {
    const nodeFirst = new Node(1);
    nodeFirst.x = 10;
    nodeFirst.y = 20;
    const nodeSecond = new Node(2);
    nodeSecond.x = 30;
    nodeSecond.y = 40;
    const link = new Link(nodeFirst, nodeSecond);

    this.links = [link];
    this.nodes = [nodeFirst, nodeSecond];
  }
}
