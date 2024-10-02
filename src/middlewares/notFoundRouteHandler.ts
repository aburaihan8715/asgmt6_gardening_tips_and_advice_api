/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';

const notFoundRouteHandler: RequestHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
};

export default notFoundRouteHandler;
