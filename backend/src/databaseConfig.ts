import { MongoClient, Db } from "mongodb";
import { LetsPairModel } from "./model";

export async function openDatabaseConnect(): Promise<Db> {
  try {
    const client = await MongoClient.connect("");
    const db: Db = client.db("");
    return db;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getCollection<T extends LetsPairModel>(
  db: Db,
  collectionName: string
) {
  this.collection = db.collection<T>(collectionName);
}
