import express, { Request, Response } from 'express';
import CrudController from '../../../crud/crud_controller';
import UpdateRequestValidator from './types/update_request_validator';
import CreateRequestValidator from './types/create_request_validator';
import ErrorMap from './types/error_map';

const router = express.Router()

router.use((req, _, next) => {
  console.log('CRUD: ', Date.now(), req.path, req.query);
  next();
});

router.put('/:id', async (req: Request, res: Response) => {
  console.log('[Update] ', req.body, req.params.id);

  const errors: ErrorMap = UpdateRequestValidator.validate(req);

  console.log('[errors] ', errors);

  if(Object.keys(errors).length) {
    return res.status(400).json(errors);
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



  res.json({});
});

router.delete('/:id', async (req: Request, res: Response) => {
  console.log('[Delete] ', req.query.id);

  res.json({});
});

export default router;
