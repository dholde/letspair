import { MongoClient, Db } from "mongodb";
import { LetsPairModel } from "./model";

async function connect(uri: string, dbName: string): Promise<Db> {
  const client = await MongoClient.connect(uri);
  const db: Db = this.client.db(dbName);
  return db;
}

function getCollection<T extends LetsPairModel>(db: Db) {
  this.collection = db.collection<T>(this.collectionName);
}
