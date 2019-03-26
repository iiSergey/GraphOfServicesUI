import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphComponent } from './graph.component';
import { LinkVisualComponent } from '../shared/link-visual/link-visual.component';
import { NodeVisualComponent } from '../shared/node-visual/node-visual.component';
import { DraggableNodeDirective } from '../directives/draggable-node.directive';
import { ZoomableOfDirective } from '../directives/zoomable-of.directive';
import { D3GraphService } from '../d3-graph.service';
import { Component } from '@angular/core';
import { Link } from '../models/link';
import { Node } from '../models/node';

@Component({
  selector: `app-host-component`,
  template: `
    <app-graph [links]="links" [nodes]="nodes"></app-graph>`,
})
class TestHostComponent {
  private links: Link[];
  private nodes: Node[];

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

  setInput(links: Link[], nodes: Node[]) {
    this.links = links;
    this.nodes = nodes;
  }
}

describe('GraphComponent', () => {

  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        GraphComponent,
        LinkVisualComponent,
        NodeVisualComponent,
        DraggableNodeDirective,
        ZoomableOfDirective,
      ],
      providers: [
        D3GraphService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    expect(testHostComponent).toBeTruthy();
  });
});
