import express, { Request, Response, Application } from 'express';
import router from './routes';
import notFoundRouteHandler from './middlewares/notFoundRouteHandler';
import globalErrorHandler from './middlewares/globalErrorHandler';

export const app: Application = express();

// GLOBAL MIDDLEWARES
app.use(express.json());

// TEST ROUTE
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Hello From Express & TypeScript Server',
  });
});

// ROUTES
app.use('/api/v1', router);

// NOT FOUND ROUTE HANDLER
app.use(notFoundRouteHandler);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
