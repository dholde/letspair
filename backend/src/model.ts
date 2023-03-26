import { ObjectId } from "mongodb";

export class LetsPairModel {
  constructor(public _id?: string | ObjectId) {}
}

export class UserModel extends LetsPairModel {
  name: string;
  constructor(public _id?: string | ObjectId, name: string) {
    super(_id);
    this.name = name;
  }
}

export class TaskModel extends LetsPairModel {}

export class LaneModel extends LetsPairModel {}
