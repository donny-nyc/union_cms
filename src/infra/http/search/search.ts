import express, { Request, Response } from 'express';
import { searchController } from '../../..';
import SearchValidator from './search_validator';

const router = express.Router()

router.use((req, _, next) => {
  console.log('Search: ', Date.now(), req.path, req.query);
  next();
});

router.get('/', async (req: Request, res: Response) => {
  console.log('[Request] ', req.query.q);

  const errors: { [key: string]: string[] } = SearchValidator.validate(req.query.q);

  if (errors.length) {
    res.status(400).json(errors);
  }

  const query: string = req.query.q as string;

  const results = await searchController.search(query);

  console.log('[search] results: ', results);

  res.json({ results });
});

export default router;
