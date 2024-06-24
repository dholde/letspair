import type { Task } from "./Task";
import type { BaseModel } from "./BaseModel";
import type { User } from "./User";

export class Lane implements BaseModel {
  public id?: string;
  public tasks: Task[];
  public users: User[];
  constructor() {
    this.tasks = [];
    this.users = [];
  }
}
