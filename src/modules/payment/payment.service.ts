import Stripe from 'stripe';
import { TPayment } from './payment.interface';
import { Payment } from './payment.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// CREATE PAYMENT INTENT
const createPaymentIntentIntoStripe = async (payload: {
  price: number;
}) => {
  const amount = Math.trunc(payload.price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  return { clientSecret: paymentIntent.client_secret };
};

// CREATE PAYMENT
const createPaymentIntoDB = async (payload: TPayment) => {
  const newPayment = await Payment.create(payload);

  if (!newPayment) {
    throw new AppError(400, 'Failed to create payment!!');
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    {
      isVerified: true,
    },
  );
  return newPayment;
};

// GET ALL PAYMENTS
const getAllPaymentsFromDB = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(Payment.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();

  return {
    meta,
    result,
  };
};

// GET PAYMENT STATS
const getPaymentStatsFromDB = async () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const previousYear = currentYear - 1;

  const data = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${previousYear}-01-01`),
          $lte: new Date(`${previousYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        numberOfPayments: { $sum: 1 },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { month: 1 },
    },
  ]);
  return data;
};

export const PaymentServices = {
  createPaymentIntentIntoStripe,
  createPaymentIntoDB,
  getAllPaymentsFromDB,
  getPaymentStatsFromDB,
};
