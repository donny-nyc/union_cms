import express, { Request, Response } from 'express';
import UpdateRequestValidator from './types/update_request_validator';
import CreateRequestValidator from './types/create_request_validator';
import FetchRequestValidator from './types/fetch_request_validator';
import ErrorMap from './types/error_map';
import { crudController } from '../../../';
import { NotFound } from '../../../crud/crud_controller';

const router = express.Router()

router.use((req, _, next) => {
  console.log('CRUD: ', Date.now(), req.path, req.query);
  next();
});

router.get('/:id', async (req: Request, res: Response) => {
  console.log('[Fetch]', req.body, req.params.id);

  const errors: ErrorMap = FetchRequestValidator.validate(req);

  console.log('[errors] ', errors);
  if(Object.keys(errors).length) {
    return res.status(400).json(errors);
  }

  const result = await crudController.fetch(req.params.id);

  console.log('[router get result]', result);

  if (result instanceof NotFound) {
    return res.status(404).send(`record not found: ${req.params.id}`);
  }

  res.json({
    id: result.product.id,
    name: result.product.name,
    price: result.product.price,
    keywords: result.product.keywords,
    unit: result.product.unit,
  });
});

router.put('/:id', async (req: Request, res: Response) => {
  console.log('[Update] ', req.body, req.params.id);

  const errors: ErrorMap = UpdateRequestValidator.validate(req);

  console.log('[errors] ', errors);
  if(Object.keys(errors).length) {
    return res.status(400).json(errors);
  }

  const result = await crudController.update(req.params.id, req.body.name, req.body.price, req.body.keywords);

  console.log('[router put result]', result);

  if (result instanceof NotFound) {
    return res.status(404).send(`record not found: ${req.params.id}`);
  }

  res.json({id: req.params.id});
});

router.post('/', async (req: Request, res: Response) => {
  console.log('[Create] ', req.body);

  const errors: ErrorMap = CreateRequestValidator.validate(req);

  console.log('[errors] ', errors);

  if(Object.keys(errors).length) {
    return res.status(400).json(errors);
  }

  const result = await crudController.create(req.body.name, req.body.price, req.body.keywords);

  res.json({ id: result.results.at(0).id });
});

router.delete('/:id', async (req: Request, res: Response) => {
  console.log('[Delete] ', req.query.id);

  if (typeof(req.query.id) !== 'string') {
    return res.status(400).send("must be a string");
  }

  const id: string = req.query.id;

  await crudController.remove(id);

  res.json({});
});

export default router;
