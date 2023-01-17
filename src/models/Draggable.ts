import type { BaseModel } from "./BaseModel";

export interface Draggable extends BaseModel {
  order: number;
  laneId?: string;
  isCurrentlyDragged?: boolean;
  isDraft?: boolean;
}
