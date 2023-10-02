import CrudController, { Fetched, Removed, Created, Updated, NotFound, CrudControllerResponse, Found } from "../../src/crud/crud_controller";
import { UpdateSuccessMessage } from "../../src/crud/repos/crud_repo_i";
import SearchController from "../../src/search/search";
import Product from "../../src/types/product";

const crudController = CrudController.newDummyCrudController();
const searchController = SearchController.newDummySearchController();

describe("crud controller fetch", () => {
  it("can return an existing record", async () => {
    const result: Created = await crudController.create("name", 5, ["keywords"]);

    const fetch: Fetched 
      = await crudController.fetch(result.results.at(0).id) as Fetched;

    const product = fetch.product;

    expect(product.id).toEqual(result.results.at(0).id);
    expect(product.name).toEqual(result.results.at(0).name);
    expect(product.price).toEqual(result.results.at(0).price);
  });
});

describe("crud controller create", () => {
  it("inserts a new record", async () => {
    const result: Created = await crudController.create("name", 5, ["keywords"]);

    expect(result.failure).not.toBeTruthy();

    const created: Product = await searchController.fetch(result.results.at(0).id) as Product;

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

    const findResult: Product = await searchController.fetch(toRemove.id) as Product;

    expect(findResult).toBeNull();
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

    const found: Product = await searchController.fetch(toFind.id) as Product;

    expect(found.name).toEqual("name");
    expect(found.id).toEqual(toFind.id);
    expect(found.keywords).toEqual(["keywords"]);
    expect(found.price).toEqual(10);
  });

  it("returns not found when the record doesn't exist", async () => {
    const randomId = Math.floor(Math.random() * 1000).toString();

    const findResults: Product = await searchController.fetch(randomId) as Product;

    expect(findResults).toBeNull();
  });
});

describe("crud controller bulk insert", () => {
  it.only("successfully creates each new record", async () => {
    const productCount: number = Math.floor(Math.random() * 10000);

    const products: Product[] = [];
    for(let i = 0; i < productCount; ++i) {
      products.push({
        name: `product ${i}`,
        price: Math.floor(Math.random() * 1000),
        keywords: ['mock', 'key', 'word'],
      });
    }

    const response: CrudControllerResponse = await crudController.bulk_insert(products);

    expect(response.results!.length).toEqual(productCount);
    expect(response.failure).toBeFalsy();

    // var in !== var of
    for(var id of response.results!) {
      console.log('find id: ', id);
      const product: Product = await searchController.fetch(id) as Product;

      expect(product).not.toBeNull();
    }

    for(var id of response.results!) {
      const deleteResult: CrudControllerResponse = await crudController.remove(id);

      expect(deleteResult instanceof NotFound).toBeFalsy();
      expect(deleteResult.failure).toBeFalsy();
    }
  });
});
