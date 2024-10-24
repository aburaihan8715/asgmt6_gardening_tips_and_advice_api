import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';
import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';

// CREATE PAYMENT INTENT
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

// CREATE PAYMENT
const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.createPaymentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment for subscription done!',
    data: result,
  });
});

// GET ALL PAYMENTS
const getAllPayments = catchAsync(async (req, res) => {
  const query = { ...req.query, isDeleted: { $ne: true } };
  const result = await PaymentServices.getAllPaymentsFromDB(query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments fetched successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// GET USER STATS
const getPaymentStats = catchAsync(async (req, res) => {
  const paymentStats = await PaymentServices.getPaymentStatsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment stats fetched successfully!',
    data: paymentStats,
  });
});
export const PaymentControllers = {
  createPaymentIntent,
  createPayment,
  getAllPayments,
  getPaymentStats,
};
