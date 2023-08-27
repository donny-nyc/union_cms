import {Db, MongoClient} from 'mongodb';
import Product from '../../types/product';
import SearchRepo from './search_repo_i';
import {ProductDB} from '../../types/db/product';

class MongoSearchRepo implements SearchRepo {
  private client: MongoClient;
  private db: Db;

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

  public async find_by_regex(query: string): Promise<Product[]> {
    const collection = this.db.collection("products");

    console.log('[search] ', query);

    const match = new RegExp(`${query}`);

    console.log('[search] match: ', match);

    const dbResults: ProductDB[] = await collection.find({keywords: { $elemMatch: { $regex: match } }}).toArray() as ProductDB[];

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

const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const client = new MongoClient(connectionString);

const repo = new MongoSearchRepo(client);

repo.dbConnect();

export default repo;
