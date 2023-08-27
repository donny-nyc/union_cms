import Repository, { CreateSuccessMessage, FindResponse, InsertResponse, RecordNotFound, RemoveResponse, RepoResult, UpdateResponse } from '../../types/repository';

const randomInt = (max: number): string => {
  const id: number = Math.floor(Math.random() * max);

  return id.toString();
}

class DummyRepository implements Repository{
  private records = new Map<string, any>();

  public insert(record: any): InsertResponse {
    const id = randomInt(1000);
    console.log('[dummy insert] ', id);

    record.id = id;

    this.records.set(id, record);

    console.log('[dummy insert] rescords', this.records);

    return {
      id,
      message: CreateSuccessMessage,
      failure: false,
    }
  }

  public update(record: any): UpdateResponse {
    const id = record.id || 'id';
    console.log('[Dummy update]', id);

    console.log('[dummy update] records', this.records);

    if (!this.records.has(id)) {
      console.log('[Dummy update] record not found');
      return new RecordNotFound(id);
    }

    this.records.set(id, record);
    console.log('[Dummy update] updated record', this.records.get(id));

    return {
      message: "Updated",
      failure: false,
      records: [ record ]
    }
  }

  public remove(id: string): RemoveResponse {
    console.log('[Dummy Remove]', id);

    if (!this.records.has(id)) {
      console.log('[Dummy Remove] id not found', id);
      return new RecordNotFound(id);
    }

    console.log('[Dummy Remove] deleting record');

    this.records.delete(id);

    return {
      message: "Removed",
      failure: false,
    }
  }

  public find(id: string): FindResponse {
    if (!this.records.has(id)) {
      return new RecordNotFound(id);
    }

    return {
      message: "Found record",
      failure: false,
      records: [this.records.get(id)],
    }
  }
}

const dummyRepo = new DummyRepository();

export default dummyRepo;
