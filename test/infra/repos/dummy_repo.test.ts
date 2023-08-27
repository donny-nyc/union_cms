import Repo from '../../../src/infra/repos/dummy_repo';
import { InsertResponse, UpdateResponse, RemoveResponse, FindResponse, UpdateSuccessMessage, CreateSuccessMessage } from '../../../src/types/repository';

describe("insert into dummy repo", () => {
  it('Returns Success', () => {
    const record = {
      name: 'record',
      price: 0,
      keywords: ['keyword']
    };

    const result: InsertResponse = Repo.insert(record);

    expect(result.failure).not.toBeTruthy();

    expect(result.message).toEqual(CreateSuccessMessage);
  });
});

describe("update through dummy repo", () => {
  it("Succeeds and replaces the original", () => {
    const original = {
      id: 'id',
      value: 'original',
    };

    const updated = {
      id: original.id,
      value: 'updated',
    };

    Repo.insert(original);

    const result: UpdateResponse = Repo.update(updated);

    expect(result.failure).not.toBeTruthy();

    expect(result.message).toEqual(UpdateSuccessMesssage);

    expect(result.results!.at(0)).toBe(updated);
  });
});

describe("find a record in dummy repo", () => {
  it("Succeeds and returns the record when it exists", () => {
    const record = {
      id: "id",
    };

    Repo.insert(record);

    const result = Repo.find(record.id);

    expect(result instanceof Success).toBeTruthy();

    expect(result.results!.length).toBe(1);

    expect(result.results!.at(0)).toBe(record);
  });

  it("NotFound when the record does not exist", () => {
    const record = {
      id: "id",
    };

    Repo.insert(record);

    const randomId = Math.floor(Math.random() * 1000) + 1000;

    const result = Repo.find(`${randomId}`);

    expect(result instanceof RecordNotFound).toBeTruthy();
  });

  it("NotFound when no record exists", () => {
    const randomId = Math.floor(Math.random() * 1000) + 1000;

    const result = Repo.find(`${randomId}`);

    expect(result instanceof RecordNotFound).toBeTruthy();
  });

});

describe("remove from dummy repo", () => {
  it("Succeeds and removes the record", () => {
    const record = {
      id: "id"
    };

    Repo.insert(record);

    Repo.remove(record.id);

    const result = Repo.find(record.id);

    expect(result instanceof RecordNotFound).toBeTruthy();
  });

  it("NotFound when the record does not exist", () => {
    const record = {
      id: "id",
    };

    Repo.insert(record);

    const randomId = Math.floor(Math.random() * 1000) + 1000;

    const result = Repo.remove(`${randomId}`);

    expect(result instanceof RecordNotFound).toBeTruthy();
  });
});
