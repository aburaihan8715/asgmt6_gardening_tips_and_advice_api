import express, { Request, Response, Application } from 'express';

export const app: Application = express();

// GLOBAL MIDDLEWARES
app.use(express.json());

// TEST ROUTE
app.get('/', (req: Request, res: Response) => {
  res.send('Hello From Express & TypeScript Server');
});

// ROUTES

// NOT FOUND ROUTE HANDLER

// GLOBAL ERROR HANDLER
