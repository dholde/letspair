export class User {
  public id: string;
  public order: number;
  public name?: string;
  public laneId?: string;

  constructor(id: string, order: number) {
    this.id = id;
    this.order = order;
  }
}
