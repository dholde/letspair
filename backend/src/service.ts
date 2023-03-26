import {
  MongoClient,
  Db,
  Collection,
  ObjectId,
  InsertOneResult,
  OptionalUnlessRequiredId,
} from "mongodb";
import { LetsPairModel, UserModel } from "./model";

class Service<T extends LetsPairModel> {
  private client: MongoClient;
  private db: Db;
  private collection: Collection<T>;

  constructor(
    private uri: string,
    private dbName: string,
    private collectionName: string
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

  async getItemById(itemType: "user" | "task" | "lane", itemId: ObjectId) {
    const collection = this.db.collection(itemType);
    try {
      const result = await collection.findOne({ _id: itemId });
    } catch (error) {
      console.error(`Error retrieving item for id ${itemId}: ${error}`);
    }
  }
}
