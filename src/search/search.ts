import SearchRepo from "./repos/search_repo_i";
import DummySearchRepo from "./repos/dummy_search_repo";
import MongoSearchRepo from './repos/mongo_search_repo';
import Product from "../types/product";

export default class SearchController {
  private repo: SearchRepo;

  private constructor(repo: SearchRepo) {
    this.repo = repo;
  }

  public async search(query: string): Promise<Product[]> {
    const searchResults = await this.repo.find_by_regex(query);

    return searchResults;
  }

  public static newDummySearchController(mocks?: Product[]): SearchController {
    if (mocks) {
      DummySearchRepo.setRecords(mocks);
    }

    return new SearchController(DummySearchRepo);
  }

  public static newSearchController(): SearchController {
    return new SearchController(MongoSearchRepo);
  }
};
