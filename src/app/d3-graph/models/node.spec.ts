import { Node } from './node';

describe('Node', () => {
  it('should create an instance', () => {
    const mockId = 99;
    expect(new Node(mockId)).toBeTruthy();
  });
});
