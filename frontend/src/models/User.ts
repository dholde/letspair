import type { Draggable } from "./Draggable";

export class User implements Draggable {
  public id!: string;
  public order: number;
  public name?: string;
  public laneId?: string;
  public isDraft?: boolean;

  // constructor(id: string, order: number) {
  //   this.id = id;
  //   this.order = order;
  // }
  constructor(order: number) {
    this.order = order;
  }
}
