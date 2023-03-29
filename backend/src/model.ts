import { ObjectId } from "mongodb";

export class LetsPairModel {
  constructor(public _id?: string | ObjectId) {}
}

export class UserModel extends LetsPairModel {
  name: string;
  constructor(name: string, public _id?: string | ObjectId) {
    super(_id);
    this.name = name;
  }
}

export class TaskModel extends LetsPairModel {}

export class LaneModel extends LetsPairModel {}
