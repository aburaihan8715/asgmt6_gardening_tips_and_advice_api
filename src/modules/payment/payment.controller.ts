import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { PaymentServices } from './payment.service';

// CREATE
const createPayment = catchAsync(async (req, res) => {
  const newPayment = await PaymentServices.createPaymentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment created successfully',
    data: newPayment,
  });
});

// GET ALL
const getAllPayments = catchAsync(async (req, res) => {
  const result = await PaymentServices.getAllPaymentsFromDB(req.query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// GET ONE
const getPayment = catchAsync(async (req, res) => {
  const Payment = await PaymentServices.getPaymentFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment retrieved successfully!',
    data: Payment,
  });
});

// DELETE ONE
const deletePayment = catchAsync(async (req, res) => {
  const deletedPayment = await PaymentServices.deletePaymentFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment deleted successfully!',
    data: deletedPayment,
  });
});

export const PaymentControllers = {
  createPayment,
  getAllPayments,
  getPayment,
  deletePayment,
};
