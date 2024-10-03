import { z } from 'zod';

const createPaymentValidationSchema = z.object({
  body: z.object({}),
});

export const PaymentValidations = {
  createPaymentValidationSchema,
};
