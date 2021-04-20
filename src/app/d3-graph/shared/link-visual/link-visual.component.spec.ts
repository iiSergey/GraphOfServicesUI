import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkVisualComponent } from './link-visual.component';
import { Node } from '../../models/node';
import { Link } from '../../models/link';
import { Component } from '@angular/core';

@Component({
  selector: `app-host-component`,
  template: `
    <svg>
      <g [appLinkVisual]="link"></g>
    </svg>
  `,
})
class TestHostComponent {
  private link: Link;

  constructor() {
    const nodeFirst = new Node(1);
    nodeFirst.x = 10;
    nodeFirst.y = 20;
    const nodeSecond = new Node(2);
    nodeSecond.x = 30;
    nodeSecond.y = 40;
    this.link = new Link(nodeFirst, nodeSecond);
  }

  setInput(newLink: Link): void {
    this.link = newLink;
  }
}

describe('LinkVisualComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LinkVisualComponent, TestHostComponent]
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
