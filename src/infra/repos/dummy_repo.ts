import Repository, { RepoResult } from '../../types/repository';

export default class DummyRepository implements Repository{
  public insert(_: any): RepoResult {
    return {
      message: "Success",
      failure: false,
    };
  }

  public remove(_: any): RepoResult {
    return {
      message: "Success",
      failure: false,
    };
  }

  public find(record: any): any {
    return record;
  }
}
