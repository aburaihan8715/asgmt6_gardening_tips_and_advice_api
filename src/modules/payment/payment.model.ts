import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

const PaymentSchema = new Schema<IPayment>({}, {});

export const Payment = model<IPayment>('Payment', PaymentSchema);
