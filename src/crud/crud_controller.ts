import Product from '../types/product';
import CrudRepo, { RemoveSuccessMessage, RecordNotFound, InsertResponse, UpdateSuccessMessage, BulkInsertResponse } from './repos/crud_repo_i';
import DummyRepository from './repos/dummy_repo';
import MongoCrudRepo from './repos/mongo_crud_repo';

export interface CrudControllerResponse {
  message: string;
  failure: boolean;
  results?: any[];
};

export class NotFound {
  message: string;
  failure: boolean = true;

  constructor(id: string) {
    this.message = `Resource not found: ${id}`;
  }
};

export class BulkInserted implements CrudControllerResponse {
  message: string = "Bulk Inserted";
  failure: boolean = false;
  results: any[] = [];

  constructor(ids: string[]) {
    this.results.push(...ids);
  }
};

export class Created implements CrudControllerResponse {
  message: string = "created";
  failure: boolean = false;
  results: any[] = [];

  constructor(id: string) {
    this.results.push({id});  
  }
};

export class Updated implements CrudControllerResponse {
  message: string = UpdateSuccessMessage;
  failure: boolean = false;
  results: any[] = [];

  constructor(updated: any[]) {
    this.results = updated;
  }
};

export class Removed implements CrudControllerResponse {
  message: string = RemoveSuccessMessage;
  failure: boolean = false;
  results: any[] = [];

  constructor(removed: any[]) {
    this.results = removed;
  }
};

export class Found implements CrudControllerResponse {
  message: string = "found";
  failure: boolean = false;
  results: any[];

  constructor(results: any[]) {
    this.results = results;
  }
}

export class Fetched implements CrudControllerResponse {
  message: string = "found";
  failure: boolean = false;
  product: Product;

  constructor(product: Product) {
    this.product = product;
  }
}

class CrudController {
  repository: CrudRepo;

  private constructor(repo: CrudRepo) {
    this.repository = repo;
  }

  public async fetch(id: string) {
    console.log('[crud_controller fetch]', id);

    const result = await this.repository.fetch_by_id(id);

    if (result instanceof RecordNotFound) {
      console.log('[crud controller] record not found');
      return new NotFound(id);
    }

    if (result.failure) {
      throw new Error(`[crud_controller fetch] ${result.message}`);
    }

    console.log('[crud_controller fetch]', result.message);

    return new Fetched(result.record);
  }

  public async create(name: string, price: number, keywords: string[]) {
    console.log('[crud_controller create] ', name, price, keywords);

    const result: InsertResponse = await this.repository.insert({
      name,
      price,
      keywords,
    });

    if (result.failure) {
      throw new Error(`[crud_controller create] ${result.message}`);
    }

    console.log('[crud_controller create] ', result.message);

    if (!result.id) {
      throw new Error(`[crud_controller create] id missing`);
    }

    return new Created(result.id);
  }

  public async bulk_insert(products: Product[]) {
    console.log('[crud_controller bulk_insert]: ', products.length);

    const result: BulkInsertResponse = await this.repository.bulk_insert(products);

    if (result.failure) {
      throw new Error(result.message);
    }

    return new BulkInserted(result.ids);
  }

  public async update(id: string, name: string, price: number, keywords: string[]) {
    console.log('[crud controller update] ', name, price, keywords);

    const result = await this.repository.update({
      id,
      name,
      price,
      keywords,
    });

    console.log('[crud controller update] result: ', result);
    if (result instanceof RecordNotFound) {
      console.log('[crud controller] record not found');
      return new NotFound(id);
    }

    if (result.failure) {
      throw new Error(result.message);
    }

    return new Updated(result.records!);
  }

  public async remove(id: string) {
    console.log('[crud controller remove]', id);

    const result = this.repository.remove(id);

    if (result instanceof RecordNotFound) {
      return new NotFound(id);
    }

    return new Removed([id]);
  }

  public static newDummyCrudController() {
    return new CrudController(DummyRepository);
  }

  public static newMongoCrudController() {
    return new CrudController(MongoCrudRepo.newRepo());
  }
}

export default CrudController;
