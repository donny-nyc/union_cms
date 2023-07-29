export interface RepoResult  {
  message: string;
  failure: boolean;
};

export default interface Repository {
  insert(record: any): RepoResult;
  remove(record: any): RepoResult;
  find(record: any): any;
};
