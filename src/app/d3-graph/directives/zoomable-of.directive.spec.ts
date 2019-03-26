import { ZoomableOfDirective } from './zoomable-of.directive';
import { D3GraphService } from '../d3-graph.service';
import { ElementRef } from '@angular/core';

describe('ZoomableOfDirective', () => {
  it('should create an instance', () => {
    const mockD3GraphService = new D3GraphService();
    const mockElementRef = new ElementRef({});
    const directive = new ZoomableOfDirective(mockD3GraphService, mockElementRef);
    expect(directive).toBeTruthy();
  });
});
