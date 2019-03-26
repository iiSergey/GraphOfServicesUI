import { TestBed } from '@angular/core/testing';

import { D3GraphService } from './d3-graph.service';

describe('D3GraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      D3GraphService,
    ],
  }));

  it('should be created', () => {
    const service: D3GraphService = TestBed.get(D3GraphService);
    expect(service).toBeTruthy();
  });
});
