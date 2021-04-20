import { ForceDirectedGraph } from './force-directed-graph';
import { Node } from './node';
import { Link } from './link';

describe('ForceDirectedGraph', () => {
  it('should create an instance', () => {
    const nodeFirst = new Node(1);
    const nodeSecond = new Node(2);
    const link = new Link(nodeFirst, nodeSecond);
    expect(new ForceDirectedGraph([nodeFirst, nodeSecond], [link], { height: 1, width: 1 }))
      .toBeTruthy();
  });
});
