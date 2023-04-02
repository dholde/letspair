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
import { DraggableItem } from "./model";

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
      throw error;
    }
  }

  async deleteItem(itemId: ObjectId) {
    try {
      const filter: Filter<T> = { _id: [itemId] };
      const result = this.collection.deleteOne(filter);
    } catch (error) {
      console.error(
        `Error deleting item with id ${itemId} from collection ${this.collectionName}: ${error}`
      );
      throw error;
    }
  }

  async getItems() {
    try {
      return await this.collection.find().toArray();
    } catch (error) {
      console.error(
        `Error retrieving all entries from the ${this.collection.collectionName} collection`
      );
      throw error;
    }
  }

  async getItemById(itemId: ObjectId | string) {
    try {
      const filter: Filter<T> = { _id: [itemId] };
      return await this.collection.findOne(filter);
    } catch (error) {
      console.error(`Error retrieving item for id ${itemId}: ${error}`);
      throw error;
    }
  }

  async updateItem(itemId: ObjectId, item: T) {
    try {
      const filter: Filter<T> = { _id: [itemId] };
      const updateDocument: WithoutId<T> = item;
      const result = await this.collection.replaceOne(filter, updateDocument);
    } catch (error) {
      console.error(`Error updating item ${JSON.stringify(item)}`);
      throw error;
    }
  }

  async handleDrag(updatedItem: T, oldIndexOfUpdatedItem: number) {
    updatedItem.laneId = updatedItem.laneId == null ? "" : updatedItem.laneId;
    const originalItem = await this.getItemById(updatedItem._id);
    const itemsCurrentLane = await this.findItemsForLaneId(updatedItem.laneId);

    if (originalItem.laneId === updatedItem.laneId) {
      this.handleOrderChangeInSameLane(
        itemsCurrentLane,
        updatedItem as WithId<T>,
        oldIndexOfUpdatedItem
      );
    } else {
      //Update new lane orders
      this.handleLaneChange(
        itemsCurrentLane,
        updatedItem as WithId<T>,
        originalItem,
        oldIndexOfUpdatedItem
      );
    }
  }

  async findItemsForLaneId(updateItemLaneId: string): Promise<WithId<T>[]> {
    const filter: Filter<T> = { _id: [updateItemLaneId] };
    const items = await this.collection.find(filter).toArray();
    return items;
  }

  handleOrderChangeInSameLane = (
    items: WithId<T>[],
    updatedItem: WithId<T>,
    oldIndexOfUpdatedItem: number
  ) => {
    const itemsWithUpdatedOrders: WithId<T>[] = this.updateItemOrders(
      items,
      updatedItem,
      oldIndexOfUpdatedItem
    );
    itemsWithUpdatedOrders.forEach((item) => {
      const filter: Filter<T> = { _id: [item._id] };
      this.collection.updateOne(filter, { $set: item as Partial<T> });
    });
  };

  updateItemOrders(
    items: WithId<T>[],
    updatedItem: WithId<T>,
    oldIndexOfUpdatedItem: number
  ) {
    return items.map((item) => {
      if (item._id === updatedItem._id) {
        item = updatedItem;
      } else if (
        item.order <= updatedItem.order &&
        item.order > oldIndexOfUpdatedItem
      ) {
        item.order = item.order - 1; // updatedTask moved from below to above the task
      } else if (
        item.order >= updatedItem.order &&
        item.order < oldIndexOfUpdatedItem
      ) {
        item.order = item.order + 1; // updatedTask moved from above to below the task
      }
      return item;
    });
  }

  async handleLaneChange(
    itemsCurrentLane: WithId<T>[],
    updatedItem: WithId<T>,
    originalItem: WithId<T>,
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
    allItems.forEach((item: WithId<T>) => {
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
