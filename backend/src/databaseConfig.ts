import { MongoClient, Db, MongoClientOptions } from "mongodb";
import { LetsPairModel } from "./model";

export async function openDatabaseConnection(): Promise<Db> {
  const options: MongoClientOptions = {
    serverSelectionTimeoutMS: 30000,
  };

  try {
    const client = await MongoClient.connect(process.env.DB_URL, options);
    const db: Db = client.db("test");
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
