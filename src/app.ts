import express, { Request, Response, Application } from 'express';
import router from './routes';

export const app: Application = express();

// GLOBAL MIDDLEWARES
app.use(express.json());

// TEST ROUTE
app.get('/', (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      success: true,
      message: 'Hello From Express & TypeScript Server',
    });
});

// ROUTES
app.use('/api/v1', router);

// NOT FOUND ROUTE HANDLER

// GLOBAL ERROR HANDLER
