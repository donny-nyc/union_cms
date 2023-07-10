import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import SearchRouter from './infra/http/search/search';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.get('/', (_: Request, res: Response) => {
  res.json({ message: 'Express CMS' });
});

app.use('/search', SearchRouter);

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});
