import { z } from 'zod';

const createPaymentValidation = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    transactionId: z.string({
      required_error: 'Transaction ID is required',
    }),
    price: z.number({ required_error: 'Price is required' }),
  }),
});

const createPaymentIntentValidation = z.object({
  body: z.object({
    price: z.number({ required_error: 'Price is required' }),
  }),
});

export const PaymentValidations = {
  createPaymentValidation,
  createPaymentIntentValidation,
};
