import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentValidations } from './payment.validation';
import { PaymentControllers } from './payment.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(PaymentValidations.createPaymentValidationSchema),
  PaymentControllers.createPayment,
);
router.get('/', PaymentControllers.getAllPayments);
router.get('/:id', PaymentControllers.getPayment);
router.delete('/:id', PaymentControllers.deletePayment);

export const PaymentRoutes = router;
