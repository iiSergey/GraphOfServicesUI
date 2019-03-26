import { SimulationNodeSetting } from '../d3-graph.config';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  linkCount = 0;

  constructor(id) {
    this.id = id;
  }

  get r() {
    return 50 * this.normal() + 10;
  }

  get fontSize() {
    return (30 * this.normal() + 10) + 'px';
  }

  get color() {
    const index = Math.floor(SimulationNodeSetting.SPECTRUM.length * this.normal());
    return SimulationNodeSetting.SPECTRUM[index];
  }

  normal = () => {
    return Math.sqrt(this.linkCount / SimulationNodeSetting.N);
  }
}
