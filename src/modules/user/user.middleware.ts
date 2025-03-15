import { NextFunction, Request, Response } from 'express';

const getAliasUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // console.log('req.originalUrl===>👿', req.originalUrl);
  // console.log('req.protocol===>👿', req.protocol);
  // console.log('req.hostname===>👿', req.hostname);
  // console.log('req.get(host)===>👿', req.get('host'));

  const sortBy = req.originalUrl.split('/').at(-1);

  req.query.limit = '5';
  req.query.sort = sortBy;
  req.query.fields =
    'username email followersCount profilePicture isVerified _id createdAt';
  next();
};

const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user._id;
  next();
};

export const UserMiddleware = {
  getAliasUsers,
  getMe,
};
