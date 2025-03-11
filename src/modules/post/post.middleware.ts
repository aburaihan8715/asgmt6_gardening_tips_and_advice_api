import { NextFunction, Request, Response } from 'express';

const getAliasPosts = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.limit = '5';
  req.query.sort = '-upvotesCount';
  req.query.fields = '-content';
  next();
};

export const PostMiddleware = {
  getAliasPosts,
};
