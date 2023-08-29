import {ObjectId} from 'mongodb';
import {InsertResponse, RemoveResponse, UpdateResponse} from '../../../src/crud/repos/crud_repo_i';
import MongoCrudRepo from '../../../src/crud/repos/mongo_crud_repo';
import MongoSearchRepo from '../../../src/search/repos/mongo_search_repo';
import Product from '../../../src/types/product';

const repo = MongoCrudRepo.newRepo();

const searchRepo = MongoSearchRepo.newRepo();

describe("Mongo-backed Crud Repo", () => {
  it("inserts valid records", async () => {
    const product: Product = {
      name: "name",
      price: 10,
      keywords: ["key", "word"],
    };

    const insertResult: InsertResponse = await repo.insert(product);

    expect(insertResult.failure).toBeFalsy();

    const deleteResult: RemoveResponse = await repo.remove(insertResult.id!);

    expect(deleteResult.failure).toBeFalsy();

    const searchResult: Product | null = await searchRepo.find_by_id(insertResult.id!);

    expect(searchResult).toBeNull();
  });

  it("updates existing records", async () => {
    const product: Product = {
      name: "name",
      price: 10,
      keywords: ["key", "word"],
    };

    const insertResult: InsertResponse = await repo.insert(product);

    expect(insertResult.failure).toBeFalsy();

    const updateResult: UpdateResponse = await repo.update({
      id: insertResult.id!,
      name: "new name",
      price: 20,
      keywords: ["new", "key", "word"],
    });

    expect(updateResult.failure).toBeFalsy();
    expect(updateResult.id!.toString()).toEqual(insertResult.id);
    expect(updateResult.records!.length).toEqual(1);
    expect(updateResult.records!.at(0)).toEqual({
      _id: new ObjectId(insertResult.id),
      name: "new name",
      price: 20,
      keywords: ["new", "key", "word"],
    });

    const searchResult: Product = await searchRepo.find_by_id(insertResult.id!) as Product;

    expect(searchResult).not.toBeNull();   

    expect(searchResult.id).toEqual(insertResult.id!);
    expect(searchResult.name).toEqual("new name");
    expect(searchResult.price).toEqual(20);
    expect(searchResult.keywords).toEqual(["new", "key", "word"]);

    const deleteResult: RemoveResponse = await repo.remove(insertResult.id!);

    expect(deleteResult.failure).toBeFalsy();
  });
});
