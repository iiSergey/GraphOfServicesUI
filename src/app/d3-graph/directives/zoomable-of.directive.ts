import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { D3GraphService } from '../d3-graph.service';

@Directive({
  selector: '[appZoomableOf]'
})
export class ZoomableOfDirective implements OnInit {
  @Input('appZoomableOf') zoomableOf: ElementRef;

  constructor(private d3GraphService: D3GraphService, private elementOFZoom: ElementRef) {
  }

  ngOnInit() {
    this.d3GraphService.applyZoomableBehaviour(this.zoomableOf, this.elementOFZoom.nativeElement);
  }
}
