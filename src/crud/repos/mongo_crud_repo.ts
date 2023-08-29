import { Collection, Db, InsertOneResult, MongoClient, ObjectId } from 'mongodb';
import Product from '../../types/product';
import CrudRepo, { InsertResponse, RemoveResponse, UpdateResponse } from './crud_repo_i';

export default class MongoCrudRepo implements CrudRepo {
  private client: MongoClient;
  private db: Db;
  private collection: Collection;

  private constructor(client: MongoClient) {
    this.client = client;
    this.db = new Db(client, "grocery");
    this.collection = this.db.collection("products");
  }

  private async dbConnect() {
    let conn;

    try {
      conn = await this.client.connect();

      this.db = conn.db("grocery");
      console.log('[mongo] connected');
    } catch(e) {
      console.error(e);
    }
  }

  public async insert(record: Omit<Product, "id">): Promise<InsertResponse> {
    const results: InsertOneResult = await this.collection.insertOne({
      name: record.name,
      price: record.price,
      keywords: record.keywords,
    });

    return {
      id: results.insertedId.toString(),
      message: "inserted",
      failure: false,
    }
  }

  public async remove(id: string): Promise<RemoveResponse> {
    await this.collection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return {
      message: `removed object ${id}`,
      failure: false,
    };
  }

  public async update(record: Product): Promise<UpdateResponse> {
    const result = await this.collection.findOneAndUpdate({
      _id: new ObjectId(record.id),
    }, {
      $set: {
        name: record.name,
        price: record.price,
        keywords: record.keywords,
      }
    }, {
      returnDocument: "after",
    });

    return {
      id: result.value?._id.toString(),
      message: `updated object: ${record.id}`,
      failure: false,
      records: [result.value],
    }
  }

  public static newRepo(): MongoCrudRepo {
    const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
    const client = new MongoClient(connectionString);

    const repo = new MongoCrudRepo(client);

    repo.dbConnect();

    return repo;
  }
};
