import express, { Request, Response, Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes';
import notFoundRouteHandler from './middlewares/notFoundRouteHandler';
import globalErrorHandler from './middlewares/globalErrorHandler';

export const app: Application = express();

// GLOBAL MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: 'https://asgmt6-gardening-tips-and-advice-api.vercel.app',
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

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
