import { Collection, Db, InsertOneResult, MongoClient, ObjectId } from 'mongodb';
import Product from '../../types/product';
import CrudRepo, { FetchResponse, BulkInsertResponse, InsertResponse, RemoveResponse, UpdateResponse } from './crud_repo_i';

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

  public async fetch_by_id(id: string): Promise<FetchResponse> {
    let objectId;

    try {
      objectId = new ObjectId(id);
    } catch (error: any) {
      return {
        message: `${error}`,
        failure: true,
      }
    }

    console.log('[mongo fetch]: ', id); 
    const result = await this.collection.findOne({ _id: objectId });

    if (!result) {
      return {
        message: `failed to find ${id}`,
        failure: true,
      }
    }

    return {
      message: 'Found',
      failure: false,
      record: {
        id: result._id,
        name: result.name,
        price: result.price,
        unit: result.unit,
      }
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

  public async bulk_insert(records: Product[]): Promise<BulkInsertResponse> {
    console.log('[mongo crud] bulk insert ', records.length!);

    await this.collection.bulkWrite(
      records.map((record: Product) => {
        return {
          insertOne: {
            document: record
          }
        }
      })
    );

    return {
      ids: records.map((record) => { return record.id! }),
      message: `bulk insert ${records.length} records`,
      failure: false,
    }
  }

  public async remove(id: string): Promise<RemoveResponse> {
    console.log('[mongo crud] remove ', id!);

    let objectId;

    try {
      objectId = new ObjectId(id);
    } catch (error: any) {
      return {
        message: `${error}`,
        failure: true,
      }
    }

    const result = await this.collection.findOneAndDelete({
      _id: objectId,
    });

    if (!result.value!) {
      return {
        message: `not found: ${id}`,
        failure: true,
      }
    }

    return {
      message: `removed object ${id}`,
      failure: false,
    };
  }

  public async update(record: Product): Promise<UpdateResponse> {
    let objectId;

    try {
      objectId = new ObjectId(record.id);
    } catch (error: any) {
      return {
        message: `${error}`,
        failure: true,
      }
    }

    console.log('[mongo update]: ', record.id!); 
    const result = await this.collection.findOneAndUpdate({
      _id: objectId,
    }, {
      $set: {
        name: record.name,
        price: record.price,
        keywords: record.keywords,
      }
    }, {
      returnDocument: "after",
    });

    if (!result.value!) {
      return {
        message: `failed to update ${record.id}`,
        failure: true,
      }
    }

    console.log('[mongo update] updated: ', result.value);

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
