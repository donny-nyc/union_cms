import CrudRepo, { BulkInsertResponse, CreateSuccessMessage, FindResponse, InsertResponse, RecordNotFound, RemoveResponse, UpdateResponse } from './crud_repo_i';

import Store, { InMemoryStore, NotFound } from '../../infra/memory_store';
import Product from '../../types/product';

const randomInt = (max: number): string => {
  const id: number = Math.floor(Math.random() * max);

  return id.toString();
}

class DummyRepository implements CrudRepo{
  private store: InMemoryStore;

  private constructor(store: InMemoryStore) {
    this.store = store;
  }

  public static newRepo() {
    return new DummyRepository(Store);
  }

  public async bulk_insert(records: Product[]): Promise<BulkInsertResponse> {
    console.log('[bulk insert] ', records.length);

    records.forEach((record: Product) => {
      const id = randomInt(10000);
      record.id = id;
      this.store.set(id, record);
    });

    console.log('dummy bulk insert ids: ', records.map(record => { return record.id }));

    return {
      ids: records.map(record => { return record.id!}),
      message: `bulk insert ${records.length} records`,
      failure: false,
    }
  };

  public async insert(record: any): Promise<InsertResponse> {
    const id = randomInt(1000);
    console.log('[dummy insert] ', id);

    record.id = id;

    //this.records.set(id, record);
    this.store.set(id, record);

    console.log('[dummy insert] records');

    return {
      id,
      message: CreateSuccessMessage,
      failure: false,
    }
  }

  public async update(record: any): Promise<UpdateResponse> {
    const id = record.id || 'id';
    console.log('[Dummy update]', id);

    console.log('[dummy update] records');

    if (this.store.find(id) instanceof NotFound) {
      console.log('[Dummy update] record not found');
      return new RecordNotFound(id);
    }

    this.store.set(id, record);
    console.log('[Dummy update] updated record', this.store.get(id));

    return {
      message: "Updated",
      failure: false,
      records: [ record ]
    }
  }

  public async remove(id: string): Promise<RemoveResponse> {
    console.log('[Dummy Remove]', id);

    if (this.store.find(id) instanceof NotFound) {
      console.log('[Dummy Remove] id not found', id);
      return new RecordNotFound(id);
    }

    console.log('[Dummy Remove] deleting record');

    this.store.remove(id);

    return {
      message: "Removed",
      failure: false,
    }
  }

  public async find(id: string): Promise<FindResponse> {
    if (this.store.find(id) instanceof NotFound) {
      return new RecordNotFound(id);
    }

    return {
      message: "Found record",
      failure: false,
      records: [this.store.get(id)],
    }
  }
}

const dummyRepo = DummyRepository.newRepo();

export default dummyRepo;
