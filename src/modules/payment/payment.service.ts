import Stripe from 'stripe';
import { TPayment } from './payment.interface';
import { Payment } from './payment.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// CREATE
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

export const PaymentServices = {
  createPaymentIntentIntoStripe,
  createPaymentIntoDB,
};
