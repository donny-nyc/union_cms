export interface RepoResult  {
  message: string;
  failure: boolean;
  records?: any[];
};

export class RecordNotFound implements RepoResult {
  message: string;
  failure: boolean = true;
  
  constructor(id: string) {
    this.message = `Resource not found: ${id}`;
  }
};

export const CreateSuccessMessage = "Created";
export const UpdateSuccessMessage = "Updated";
export const RemoveSuccessMessage = "Removed";

export type InsertResponse = {
  id?: string;
  message: string;
  failure: boolean;
};

export type UpdateResponse = {
  id?: string;
  message: string;
  failure: boolean;
  records?: any[];
};

export type RemoveResponse = {
  id?: string;
  message: string;
  failure: boolean;
};

export type FindResponse = {
  message: string;
  failure: boolean;
  records?: any[];
}

export default interface Repository {
  insert(record: any): InsertResponse;
  update(record: any): UpdateResponse;
  remove(id: string): RemoveResponse;
  find(id: string): FindResponse;
};
