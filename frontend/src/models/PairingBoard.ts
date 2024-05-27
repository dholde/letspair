import type { BaseModel } from "./BaseModel";
import type { Task } from "./Task";
import type { User } from "./User";
import type { Lane } from "./Lane";

export class PairingBoard implements BaseModel {
  public id?: string; // Optional since it is determined by the database
  public tasks: Task[];
  public users: User[];
  public lanes: Lane[];

  constructor() {
    this.tasks = [];
    this.users = [];
    this.lanes = [];
  }
}
