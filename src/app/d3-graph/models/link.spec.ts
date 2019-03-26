import { Link } from './link';
import { Node } from './node';

describe('Link', () => {
  it('should create an instance', () => {
    const nodeFirst = new Node(1);
    const nodeSecond = new Node(2);
    expect(new Link(nodeFirst, nodeSecond)).toBeTruthy();
  });
});
