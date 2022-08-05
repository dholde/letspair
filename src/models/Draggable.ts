import type { BaseModel } from "./BaseModel";

export interface Draggable extends BaseModel {
  laneId?: string;
  isCurrentlyDragged?: boolean;
  isDraft?: boolean;
}
