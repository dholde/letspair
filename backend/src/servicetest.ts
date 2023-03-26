import { MongoClient, Db, Collection, InsertOneResult } from "mongodb";

class Database<T> {
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

  async insertOne(document: T): Promise<InsertOneResult> {
    return this.collection.insertOne(document);
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
