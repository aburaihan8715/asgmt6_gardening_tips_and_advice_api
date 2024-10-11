import express from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidations.registerValidationSchema),
  AuthControllers.registerUser,
);
router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);

router.patch(
  '/change-password',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.accessTokenByRefreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

router.patch(
  '/reset-password',
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

router.patch(
  '/settings-profile',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  multerUpload.single('file'),
  validateRequest(AuthValidations.settingsProfileValidationSchema),
  AuthControllers.settingsProfile,
);

export const AuthRoutes = router;
