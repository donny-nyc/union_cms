import Repo from '../../../src/crud/repos/dummy_repo';
import { InsertResponse, UpdateResponse, RemoveResponse, FetchResponse, UpdateSuccessMessage, CreateSuccessMessage, RecordNotFound } from '../../../src/crud/repos/crud_repo_i';

describe("insert into dummy repo", () => {
  it('Returns Success', async () => {
    const record = {
      name: 'record',
      price: 0,
      keywords: ['keyword']
    };

    const result: InsertResponse = await Repo.insert(record);

    expect(result.failure).not.toBeTruthy();

    expect(result.message).toEqual(CreateSuccessMessage);
  });
});

describe("update through dummy repo", () => {
  it("Succeeds and replaces the original", async () => {
    const original = {
      name: 'original',
      price: 1,
      keywords: ['keywords']
    };

    const insertResult: InsertResponse = await Repo.insert(original);

    const updated = {
      id: insertResult.id,
      name: 'updated',
    };

    const result: UpdateResponse = await Repo.update(updated);

    expect(result.failure).not.toBeTruthy();

    expect(result.message).toEqual(UpdateSuccessMessage);

    expect(result.records!.at(0)).toBe(updated);
  });
});

describe("fetch a record in dummy repo", () => {
  it("Succeeds and returns the record when it exists", async () => {
    const record = {
      id: "id",
    };

    await Repo.insert(record);

    const result = await Repo.find(record.id);

    expect(result.record).not.toBeNull();

    expect(result.record).toBe(record);
  });

  it("NotFound when the record does not exist", async () => {
    const record = {
      id: "id",
    };

    await Repo.insert(record);

    const randomId = Math.floor(Math.random() * 1000) + 1000;

    const result = await Repo.find(`${randomId}`);

    expect(result instanceof RecordNotFound).toBeTruthy();
  });

  it("NotFound when no record exists", async () => {
    const randomId = Math.floor(Math.random() * 1000) + 1000;

    const result = await Repo.find(`${randomId}`);

    expect(result instanceof RecordNotFound).toBeTruthy();
  });

});

describe("remove from dummy repo", () => {
  it("Succeeds and removes the record", async () => {
    const record = {
      id: "id"
    };

    await Repo.insert(record);

    await Repo.remove(record.id);

    const result = await Repo.find(record.id);

    expect(result instanceof RecordNotFound).toBeTruthy();
  });

  it("NotFound when the record does not exist", async () => {
    const record = {
      id: "id",
    };

    await Repo.insert(record);

    const randomId = Math.floor(Math.random() * 1000) + 1000;

    const result = await Repo.remove(`${randomId}`);

    expect(result instanceof RecordNotFound).toBeTruthy();
  });
});
