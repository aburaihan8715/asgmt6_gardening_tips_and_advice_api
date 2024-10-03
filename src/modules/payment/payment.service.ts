import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';

// CREATE
const createPaymentIntoDB = async (payload: IPayment) => {
  let newPayment = await Payment.create(payload);

  if (!newPayment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to cerate Payment. Try again!',
    );
  }
  newPayment = newPayment.toObject();
  delete newPayment.__v;

  return newPayment;
};

// GET ALL
const getAllPaymentsFromDB = async (query: Record<string, unknown>) => {
  const PaymentQuery = new QueryBuilder(
    Payment.find({ isDeleted: { $ne: true } }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PaymentQuery.modelQuery;
  const meta = await PaymentQuery.countTotal();

  return {
    meta,
    result,
  };
};

// GET ONE
const getPaymentFromDB = async (id: string) => {
  const result = await Payment.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found !');
  }

  // if (result && result.isDeleted) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'Payment has been deleted!',
  //   );
  // }
  return result;
};

// DELETE ONE
const deletePaymentFromDB = async (id: string) => {
  const result = await Payment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found !');
  }

  return result;
};

export const PaymentServices = {
  createPaymentIntoDB,
  getAllPaymentsFromDB,
  getPaymentFromDB,
  deletePaymentFromDB,
};
