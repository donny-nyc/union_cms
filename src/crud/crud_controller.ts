import Repository, { RemoveSuccessMessage, RecordNotFound, InsertResponse, UpdateSuccessMessage } from '../types/repository';

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

class CrudController {
  repository: Repository;

  constructor(repo: Repository) {
    this.repository = repo;
  }

  public async create(name: string, price: number, keywords: string[]) {
    console.log('[crud_controller create] ', name, price, keywords);

    const result: InsertResponse = this.repository.insert({
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

  public async update(id: string, name: string, price: number, keywords: string[]) {
    console.log('[crud controller update] ', name, price, keywords);

    const result = this.repository.update({
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

  public async find_one(id: string) {
    console.log('[crud controller find_one]', id);

    const result = this.repository.find(id);

    if (result instanceof RecordNotFound) {
      return new NotFound(id);
    }

    if (result.failure) {
      throw new Error(result.message);
    }

    if (!result.records) {
      throw new Error("no results returned");
    }

    return new Found(result.records);
  }
}

export const CrudControllerFactory = (repo: Repository): CrudController => {
  return new CrudController(repo);
};

export default CrudControllerFactory;
