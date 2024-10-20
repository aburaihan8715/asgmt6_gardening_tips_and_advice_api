import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

// CREATE
const createPaymentIntent = catchAsync(async (req, res) => {
  const result = await PaymentServices.createPaymentIntentIntoStripe(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent created successfully !',
    data: result,
  });
});

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.createPaymentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment for subscription done!',
    data: result,
  });
});

export const PaymentControllers = {
  createPaymentIntent,
  createPayment,
};
