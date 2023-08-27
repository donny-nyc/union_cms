import CrudController, { Removed, Created, Updated, NotFound, CrudControllerResponse, Found } from "../../src/crud/crud_controller";
import {UpdateSuccessMessage} from "../../src/types/repository";

const crudController = CrudController.newDummyCrudController();

describe("crud controller create", () => {
  it("inserts a new record", async () => {
    const result: Created = await crudController.create("name", 5, ["keywords"]);

    expect(result.failure).not.toBeTruthy();

    const searchResult: CrudControllerResponse = await crudController.find_one(result.results.at(0).id);

    expect(searchResult instanceof Found).toBeTruthy();

    expect(searchResult.failure).not.toBeTruthy();

    expect(searchResult.results).not.toBeUndefined();

    expect(searchResult.results!.length).toBe(1);

    const created = searchResult.results!.at(0);

    expect(created.name).toEqual("name");
    expect(created.price).toEqual(5);
    expect(created.keywords).toEqual(["keywords"]);
    expect(created.id).not.toBeUndefined();
  });
});

describe("crud controller update", () => {
  it("updates an existing record", async () => {
    const result: Created = await crudController.create("name", 5, ["keywords"]);

    const created = result.results!.at(0);

    const updatedResult: CrudControllerResponse = await crudController.update(created.id, "updated name", 10, ["updated", "keywords"]);

    console.log(`[updated result]`, updatedResult);
    expect(updatedResult instanceof Updated).toBeTruthy();

    expect(updatedResult.failure).not.toBeTruthy();

    expect(updatedResult.message).toEqual(UpdateSuccessMessage);

    expect(updatedResult.results!.length).toEqual(1);

    const updated = updatedResult.results!.at(0);

    expect(updated.name).toEqual("updated name");
    expect(updated.price).toEqual(10);

    expect(updated.keywords).toEqual(["updated", "keywords"]);
  });

  it("returns not found, if the record doesn't exist", async () => {
    const randomId = Math.floor(Math.random() * 1000).toString();

    const updatedName = "updated name";
    const updatedPrice = Math.floor(Math.random() * 1000);
    const updatedKeywords = ["updated", "keywords"];

    const result: CrudControllerResponse = await crudController.update(
      randomId, 
      updatedName, 
      updatedPrice, 
      updatedKeywords);

    expect(result instanceof NotFound).toBeTruthy();
  });
});

describe("crud controller remove", () => {
  it("removes an existing record", async () => {
    const createResult: CrudControllerResponse = await crudController.create("name", 10, ["keywords"]);

    const toRemove = createResult.results!.at(0);

    const removeResult: CrudControllerResponse = await crudController.remove(createResult.results!.at(0).id);

    expect(removeResult instanceof Removed).toBeTruthy();

    expect(removeResult.results!.length).toEqual(1);

    expect(removeResult.results!.at(0)).toEqual(toRemove.id);

    const findResult: CrudControllerResponse = await crudController.find_one(toRemove.id);

    expect(findResult instanceof NotFound);
  });

  it("returns Not Found if the record doesn't exist", async () => {
    const randomId = Math.floor(Math.random() * 1000).toString();

    const removeResult: CrudControllerResponse = await crudController.remove(randomId);

    expect(removeResult instanceof NotFound);
  });
});

describe("crud controller find", () => {
  it("finds an existing record", async () => {
    const createRecord: CrudControllerResponse = await crudController.create("name", 10, ["keywords"]);

    const toFind = createRecord.results!.at(0);

    const findResult: CrudControllerResponse = await crudController.find_one(toFind.id);

    console.log(`[to find]`, toFind);
    expect(findResult instanceof Found);

    const found = findResult.results!.at(0);

    console.log(`[found]`, found);

    expect(found.name).toEqual("name");
    expect(found.id).toEqual(toFind.id);
    expect(found.keywords).toEqual(["keywords"]);
    expect(found.price).toEqual(10);
  });

  it("returns not found when the record doesn't exist", async () => {
    const randomId = Math.floor(Math.random() * 1000).toString();

    const findResults: CrudControllerResponse = await crudController.find_one(randomId);

    expect(findResults instanceof NotFound);
  });
});
