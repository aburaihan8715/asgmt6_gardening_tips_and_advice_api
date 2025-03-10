import { NextFunction, Request, Response } from 'express';

const getAliasUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.limit = '5';
  req.query.sort = '-followersCount';
  req.query.fields =
    'username email followersCount profilePicture isVerified _id';
  next();
};

export const UserMiddleware = {
  getAliasUsers,
};
