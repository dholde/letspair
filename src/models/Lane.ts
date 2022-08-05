import type { BaseModel } from "./BaseModel";

export class Lane implements BaseModel {
  public id: string;
  constructor(id: string) {
    this.id = id;
  }
}
