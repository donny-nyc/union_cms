import { Db, MongoClient } from 'mongodb';
import { ProductDB } from '../types/db/product';

class CrudController {
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

  public async create(name: string, price: number, keywords: string[]) {
    const collection = this.db.collection("products");

    console.log('[create] ', name, price, keywords);

    const results = await collection.insertOne({
      name,
      price,
      keywords,
    });

    console.log('[create] ', results);
  }
}
const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const client = new MongoClient(connectionString);

const controller = new CrudController(client);

controller.dbConnect();

export default controller;
