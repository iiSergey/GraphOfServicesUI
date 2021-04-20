import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NodeVisualComponent } from './node-visual.component';
import { Component } from '@angular/core';
import { Node } from '../../models/node';

@Component({
  selector: `app-host-component`,
  template: `
    <svg>
      <g [appNodeVisual]="node"></g>
    </svg>
  `,
})
class TestHostComponent {
  node: Node;

  constructor() {
    this.node = new Node(1);
    this.node.x = 10;
    this.node.y = 20;
  }

  setInput(newNode: Node): void {
    this.node = newNode;
  }
}

describe('NodeVisualComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NodeVisualComponent, TestHostComponent]
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
