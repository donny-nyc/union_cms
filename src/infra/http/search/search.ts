import express, { Request, Response } from 'express';
import SearchController from '../../../search/search';

const router = express.Router()

router.use((req, _, next) => {
  console.log('Search: ', Date.now(), req.path, req.query);
  next();
});

router.get('/', async (req: Request, res: Response) => {
  const collection = SearchController.db.collection("products");

  console.log('[Request] ', req.query.q);

  const match = new RegExp(`[${req.query.q}]`);

  console.log('[Request] match: ', match);

  const results = await collection.find({keywords: { $elemMatch: { $regex: match } }}).toArray();

  console.log('[search] results: ', results);

  res.json({ results });
});

export default router;
