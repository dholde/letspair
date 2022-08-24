import type { Draggable } from "./Draggable";

export class Task implements Draggable {
  public id: string;
  public description: string;
  public order: number;
  public link?: string;
  public linkText?: string;
  public laneId?: string;
  public isCurrentlyDragged?: boolean;
  public isDraft?: boolean;

  constructor(id: string, description: string, order: number) {
    this.id = id;
    this.description = description;
    this.order = order;
  }
}
