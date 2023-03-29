import {
  MongoClient,
  Db,
  Collection,
  ObjectId,
  InsertOneResult,
  OptionalUnlessRequiredId,
  Filter,
  WithoutId,
} from "mongodb";
import { LetsPairModel, UserModel } from "./model";

class Service<T extends LetsPairModel> {
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
}
