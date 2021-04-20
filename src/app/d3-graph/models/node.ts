import { SimulationNodeSetting } from '../d3-graph.config';
import * as d3 from 'd3';

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

  constructor(id: string|number) {
    this.id = id.toString();
  }

  get r(): number {
    return 50 * this.normal() + 10;
  }

  get fontSize(): string {
    return `${30 * this.normal() + 10}px`;
  }

  get color(): string {
    const index = Math.floor(SimulationNodeSetting.SPECTRUM.length * this.normal());
    return SimulationNodeSetting.SPECTRUM[index];
  }

  private normal(): number {
    return Math.sqrt(this.linkCount / SimulationNodeSetting.N);
  }
}
