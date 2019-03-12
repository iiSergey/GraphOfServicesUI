import { ForceDirectedGraph } from './force-directed-graph';

describe('ForceDirectedGraph', () => {
  it('should create an instance', () => {
    expect(new ForceDirectedGraph([], [], { width: 1, height: 1 })).toBeTruthy();
  });
});
