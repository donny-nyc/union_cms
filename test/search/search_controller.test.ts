import SearchController from "../../src/search/search";
import Product from '../../src/types/product';
import MockProducts from "./mocks/mock_products";

const searchController = SearchController.newDummySearchController(MockProducts);

describe("Search Controller", () => {
  it("returns results on keyword matches", async () => {
    const query = "snack";
    const searchResults: Product[] = await searchController.search(query);

    console.log('[results]', searchResults);

    expect(searchResults.length).toEqual(3);
  });

  it("returns results on partial keyword matches", async () => {
    const query = "glut"; //en-free
    const searchResults: Product[] = await searchController.search(query);

    console.log('[results]', searchResults);

    expect(searchResults.length).toEqual(1);
  });

  it("returns empty when no keywords match", async () => {
    const query = "garbage in";
    const searchResults: Product[] = await searchController.search(query);

    expect(searchResults.length).toEqual(0);
  });
});
