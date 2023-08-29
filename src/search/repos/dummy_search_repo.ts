import Product from "../../types/product";
import SearchRepo from "./search_repo_i";
import MockProducts from './mocks/mock_products';
import Store, { InMemoryStore, NotFound } from '../../infra/memory_store';

class DummySearchRepo implements SearchRepo {
  private store: InMemoryStore;

  private constructor(store: InMemoryStore) {
    this.store = store;

    this.insert_all(MockProducts);

    console.log('[DummySearchRepo]');
  }

  public static newRepo() {
    return new DummySearchRepo(Store);
  }

  public async find_by_id(id: string): Promise<Product | null> {
    if(this.store.find(id) instanceof NotFound) {
      return null;
    }

    return this.store.find(id);
  }

  public async find_by_regex(query: string): Promise<Product[]> {
    const match = new RegExp(query);

    console.log('[find_by_regex] match: ', match);

    const matchesKeyword = (record: Product) => {
      console.log(record.keywords.some(keyword => {
        return match.test(keyword)
      }));

      return record.keywords.some(keyword => {
        return match.test(keyword)
      });
    }

    const results: Product[] = Array.from(this.store.getRecords().values()).filter(matchesKeyword);

    console.log('[find_by_regex]', results);

    return new Promise<Product[]>((resolve, _) => {
      resolve(results);
    });
  }

  public insert_all(mocks: Product[]) {
    this.store.insert_all(mocks);
  }
};

const repo = DummySearchRepo.newRepo();

export default repo;
