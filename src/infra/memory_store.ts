import Product from "../types/product";

export class NotFound {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }
};

export class InMemoryStore {
  private records = new Map<string, any>();

  public insert_all(products: Product[]) {
    products.forEach((product: Product) => {
      this.records.set(product.id!, product);
    });
  }

  public set(key: string, record: any) {
    this.records.set(key, record);
  }

  public get(key: string): any {
    return this.records.get(key);
  }

  public getRecords(): Map<string, any> {
    return this.records;
  }

  public remove(key: string) {
    this.records.delete(key);
  }

  public find(key: string): any {
    if (!this.records.has(key)) {
      return new NotFound(key);
    }

    return this.records.get(key);
  }

  private constructor() {}

  public static newStore() {
    return new InMemoryStore();
  }
};

const store = InMemoryStore.newStore();

export default store;
