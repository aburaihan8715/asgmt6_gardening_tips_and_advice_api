import { NextFunction, Request, Response } from 'express';

const getAliasPayments = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sortBy = req.originalUrl.split('/').at(-1);

  req.query.limit = '5';
  req.query.sort = sortBy;
  req.query.fields = 'email transactionId price createdAt';
  next();
};

export const PaymentMiddleware = {
  getAliasPayments,
};
