import { Response } from 'express';

const sendNotFoundDataResponse = (res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'No Data Found',
    data: [],
  });
};

export default sendNotFoundDataResponse;
