import Product from "../../types/product";

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

export default interface CrudRepo {
  insert(record: Omit<Product, "id">): Promise<InsertResponse>;
  remove(id: string): Promise<RemoveResponse>;
  update(record: Product): Promise<UpdateResponse>;
};
