import { ObjectId } from "mongodb";

export class LetsPairModel {
  constructor(public _id?: string | ObjectId) {}
}

export class DraggableItem extends LetsPairModel {
  order: number;
  laneId: string;
  constructor(order: number, laneId: string, public _id?: string | ObjectId) {
    super(_id);
    this.order = order;
    this.laneId = laneId;
  }
}

export class UserModel extends DraggableItem {
  name: string;
  constructor(
    name: string,
    order: number,
    laneId: string,
    public _id?: string | ObjectId
  ) {
    super(order, laneId, _id);
    this.name = name;
  }
}

export class TaskModel extends DraggableItem {}

export class LaneModel extends LetsPairModel {}
