import { Router } from 'express';
import { PaymentControllers } from './payment.controller';
import { PaymentValidations } from './payment.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-payment-intent',
  auth(USER_ROLE.user),
  validateRequest(PaymentValidations.createPaymentIntentValidation),
  PaymentControllers.createPaymentIntent,
);
router.post(
  '/create-payment',
  auth(USER_ROLE.user),
  validateRequest(PaymentValidations.createPaymentValidation),
  PaymentControllers.createPayment,
);

export const PaymentRoutes = router;
