import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import SearchRouter from './infra/http/search/search';
import CrudRouter from './infra/http/crud/crud_router';

import DummyRepository from "./infra/repos/dummy_repo";
import CrudControllerFactory from "./crud/crud_controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

// Inject Dependencies
export const crudController = CrudControllerFactory(DummyRepository);

app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'Express CMS' });
});

app.use('/search', SearchRouter);

app.use('/crud', CrudRouter);

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});
