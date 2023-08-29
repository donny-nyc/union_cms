import {Collection, Db, MongoClient, ObjectId} from 'mongodb';
import Product from '../../types/product';
import SearchRepo from './search_repo_i';
import {ProductDB} from '../../types/db/product';

export default class MongoSearchRepo implements SearchRepo {
  private client: MongoClient;
  private db: Db;
  private collection: Collection;

  private constructor(client: MongoClient) {
    this.client = client;
    this.db = new Db(client, "grocery");
    this.collection = this.db.collection("products");
  }

  public static newRepo(): MongoSearchRepo {
    const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

    const client = new MongoClient(connectionString);

    const repo = new MongoSearchRepo(client);

    repo.dbConnect();

    return repo;
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

  public async find_by_id(id: string): Promise<Product | null> {
    const result = await this.collection.find({
      _id: new ObjectId(id),
    }).toArray();

    if (result.length === 0) {
      return null;
    }

    return {
      id: result.at(0)!._id.toString(),
      name: result.at(0)!.name,
      price: result.at(0)!.price,
      keywords: result.at(0)!.keywords,
    }
  }

  public async find_by_regex(query: string): Promise<Product[]> {
    console.log('[search] ', query);

    const match = new RegExp(`${query}`);

    console.log('[search] match: ', match);

    const dbResults: ProductDB[] = await this.collection.find({keywords: { $elemMatch: { $regex: match } }}).toArray() as ProductDB[];

    console.log('[search] results: ', dbResults);

    const results: Product[] = dbResults.map(dbResult => {
      return {
        id: dbResult._id.toString(),
        name: dbResult.name,
        price: dbResult.price,
        keywords: dbResult.keywords,
      }
    });

    return results;
  };
};
