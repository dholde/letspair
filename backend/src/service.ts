import { MongoClient, Db } from "mongodb";

let db: Db;

async function setupDB() {
  const client: MongoClient = new MongoClient("uri");
  await client.connect();
  db = client.db("default");
}

setupDB();

type User = {
  id: string;
  name: string;
};

type Task = {
  id: string;
  name: string;
};

type Lane = {
  id: string;
  name: string;
};

const serviceFunctions = {
  async saveItem(itemType: "user" | "task" | "lane", item: User | Task | Lane) {
    const collection = db.collection(itemType);
    try {
      const result = await collection.insertOne(item);
    } catch (error) {
      console.error(
        `Error saving ${itemType} ${JSON.stringify(item)}: ${error}`
      );
    }
  },
};
