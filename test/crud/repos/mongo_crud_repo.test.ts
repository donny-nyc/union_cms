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

  it("returns failure when updating unknown records", async () => {
    const randomId = "000000000000";

    const updateResult: UpdateResponse = await repo.update({
      id: randomId,
      name: "new name",
      price: 20,
      keywords: ["new", "key", "word"],
    });

    expect(updateResult.failure).toBeTruthy();
    expect(updateResult.message).toEqual(`failed to update ${randomId}`);
  });

  it("returns failure when updating with invalid id", async () => {
    const invalidId = "0";

    const updateResult: UpdateResponse = await repo.update({
      id: invalidId,
      name: "new name",
      price: 20,
      keywords: ["new", "key", "word"],
    });

    console.log(updateResult);

    expect(updateResult.failure).toBeTruthy();
    expect(updateResult.message).toEqual('BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer');
  });

  it("fails when removing a record that doesn't exist", async () => {
    const randomId = "000000000000";

    const deleteResult: RemoveResponse = await repo.remove(randomId);

    expect(deleteResult.failure).toBeTruthy();
    expect(deleteResult.message).toEqual(`not found: ${randomId}`);
  });

  it("fails when deleting with an invalid id", async () => {
    const invalidId = "0";
    const deleteResult: RemoveResponse = await repo.remove(invalidId);

    console.log(deleteResult);

    expect(deleteResult.failure).toBeTruthy();
    expect(deleteResult.message).toEqual('BSONError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer');
  });
});
