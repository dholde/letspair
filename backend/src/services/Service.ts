import {
  Collection,
  ObjectId,
  InsertOneResult,
  OptionalUnlessRequiredId,
  Filter,
  WithoutId,
  WithId,
} from "mongodb";
import { DraggableItem, LetsPairModel } from "../model";

export class Service<T extends LetsPairModel> {
  protected collection: Collection<T>;

  constructor(collection: Collection<T>) {
    this.collection = collection;
  }

  async saveItem(item: OptionalUnlessRequiredId<T>): Promise<LetsPairModel> {
    try {
      const result = await this.collection.insertOne(item);
      return await this.getItemById(result.insertedId);
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
        `Error deleting item with id ${itemId} from collection ${this.collection.collectionName}: ${error}`
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
      const filter: Filter<T> = { _id: new ObjectId(itemId) } as Filter<T>;
      return await this.collection.findOne(filter);
    } catch (error) {
      console.error(`Error retrieving item for id ${itemId}: ${error}`);
      throw error;
    }
  }

  async updateItem(itemId: ObjectId, item: T) {
    try {
      const filter: Filter<T> = { _id: itemId } as Filter<T>;
      //const updateDocument: WithoutId<T> = { ...item };
      //const updateDocument: Omit<T, "_id"> = { ...item };
      const itemWithoutId = this.removeIdField(item);
      const result = await this.collection.replaceOne(filter, itemWithoutId);
      if (result.modifiedCount === 1) {
        const updatedItem = await this.getItemById(itemId);
        return updatedItem;
      } else {
        throw "Not Found";
      }
    } catch (error) {
      console.error(`Error updating item ${JSON.stringify(item)}: ${error}`);
      throw error;
    }
  }

  removeIdField(item: T): WithoutId<T> {
    const { _id, ...itemWithoutId } = item;
    return itemWithoutId as WithoutId<T>;
  }
}
