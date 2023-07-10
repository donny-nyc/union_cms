import express, { Request, Response } from 'express';
import SearchController from '../../../search/search';

const router = express.Router()

router.use((req, _, next) => {
  console.log('Search: ', Date.now(), req.path, req.query);
  next();
});

router.get('/', async (_: Request, res: Response) => {
  const collection = SearchController.db.collection("products");

  const results = await collection.find({}).toArray();

  console.log('[search] results: ', results);

  res.json({ results });
});

export default router;
