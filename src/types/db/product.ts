import type { WithId, Document } from 'mongodb';

export interface ProductDB extends WithId<Document> {
  name: string;
  price: number;
  keywords: string[];
};
