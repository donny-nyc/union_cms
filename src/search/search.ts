import { Db, MongoClient } from "mongodb";

class SearchController {
  client: MongoClient;
  db: Db;

  constructor(client: MongoClient) {
    this.client = client;
    this.db = new Db(client, "grocery");
  }

  public async dbConnect() {
    let conn;
    try {
      conn = await this.client.connect();

      this.db = conn.db("grocery");
      console.log('[mongo] connected');
    } catch(e) {
      console.error(e);
    }
  }

  public async search(query: string) {
    const collection = this.db.collection("products");

    console.log('[search] ', query);

    const match = new RegExp(`${query}`);

    console.log('[search] match: ', match);

    const results = await collection.find({keywords: { $elemMatch: { $regex: match } }}).toArray();

    console.log('[search] results: ', results);

    return results;
  }
};

const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const client = new MongoClient(connectionString);

const controller = new SearchController(client);

controller.dbConnect();

export default controller;
