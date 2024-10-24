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

router.get('/', auth(USER_ROLE.admin), PaymentControllers.getAllPayments);

// Get payment stats
router.get(
  '/payment-stats',
  auth(USER_ROLE.admin),
  PaymentControllers.getPaymentStats,
);

export const PaymentRoutes = router;
