import Product from "../../types/product";

export default interface SearchRepo {
  find_by_id(id: string): Promise<Product | null>;
  find_by_regex(query: string): Promise<Product[]>;
};
