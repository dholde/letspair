import {
  MongoClient,
  Db,
  Collection,
  ObjectId,
  InsertOneResult,
  OptionalUnlessRequiredId,
  Filter,
  WithoutId,
  WithId,
} from "mongodb";
import { DraggableItem, LetsPairModel, TaskModel, UserModel } from "./model";

class Service<T extends DraggableItem> {
  private client: MongoClient;
  private db: Db;
  private collection: Collection<T>;

  constructor(
    private uri: string,
    private dbName: string,
    private collectionName: "user" | "task" | "lane"
  ) {}

  async connect(): Promise<void> {
    this.client = await MongoClient.connect(this.uri);
    this.db = this.client.db(this.dbName);
    this.collection = this.db.collection<T>(this.collectionName);
  }

  async saveItem(item: OptionalUnlessRequiredId<T>): Promise<InsertOneResult> {
    try {
      return this.collection.insertOne(item);
    } catch (error) {
      console.error(
        `Error saving ${item.constructor.name} ${JSON.stringify(
          item
        )}: ${error}`
      );
    }
  }

  async getItems() {
    try {
      return await this.collection.find().toArray();
    } catch (error) {
      console.error(
        `Error retrieving all entries from the ${this.collection.collectionName} collection`
      );
    }
  }

  async getItemById(itemId: ObjectId) {
    try {
      const filter: Filter<T> = { _id: [itemId] };
      return await this.collection.findOne(filter);
    } catch (error) {
      console.error(`Error retrieving item for id ${itemId}: ${error}`);
    }
  }

  async updateItem(itemId: ObjectId, item: T) {
    try {
      const filter: Filter<T> = { _id: [itemId] };
      const updateDocument: WithoutId<T> = item;
      const result = await this.collection.replaceOne(filter, updateDocument);
    } catch (error) {
      console.error(`Error updating item ${JSON.stringify(item)}`);
    }
  }

  async handleLaneIdUpdate(updatedItem: T, oldIndexOfUpdatedItem: number) {}

  async handleLaneChange(
    itemsCurrentLane: T[],
    updatedItem: T,
    originalItem: T,
    oldIndexOfUpdatedItem: number
  ) {
    //Update new lane orders
    itemsCurrentLane.map((item) => {
      if (item.order >= updatedItem.order) {
        item.order = item.order + 1;
      }
      return item;
    });
    //Update old lane orders
    const filter: Filter<T> = { laneId: [originalItem.laneId] };
    const itemsFormerLane = await this.collection.find(filter).toArray();
    itemsFormerLane.forEach((item) => {
      if (item._id === updatedItem._id) {
        item.laneId = updatedItem.laneId;
        item.order = updatedItem.order;
      } else if (item.order >= oldIndexOfUpdatedItem) {
        item.order = item.order - 1;
      }
    });
    const allItems = [...itemsCurrentLane, ...itemsFormerLane];
    allItems.forEach((item) => {
      const filter: Filter<T> = { _id: [item._id] };
      const update: Partial<T> = {};
      Object.keys(item).forEach((key) => {
        if (key !== "_id" && item[key] !== originalItem[key]) {
          update[key] = item[key];
        }
      });
      this.collection.updateOne(filter, { $set: update });
    });
  }
}
