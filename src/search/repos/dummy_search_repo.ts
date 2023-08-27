import Product from "../../types/product";
import SearchRepo from "./search_repo_i";
import MockProducts from './mocks/mock_products';

class DummySearchRepo implements SearchRepo {
  private records: Product[] = [];

  constructor() {
    this.records.push(...MockProducts);

    console.log('[DummySearchRepo]', this.records);
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

    const results: Product[] = this.records.filter(matchesKeyword);

    console.log('[find_by_regex]', results);

    return new Promise<Product[]>((resolve, _) => {
      resolve(results);
    });
  }

  public setRecords(products: Product[]) {
    this.records = products;
  }
};

const repo = new DummySearchRepo();

export default repo;
