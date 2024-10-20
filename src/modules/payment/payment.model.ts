import { Schema, model } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'User email is required'],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction id is required'],
      unique: true,
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<TPayment>('Payment', paymentSchema);
