import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { IUser } from '../user/user.interface';
import { setResponseCookies } from './auth.utils';
import SendEmail from '../../email/SendEmail';
import config from '../../config';

const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  const userInfo = await AuthServices.registerIntoDB({
    username,
    email,
    password,
  } as IUser);

  const { refreshToken, accessToken, user } = userInfo;

  setResponseCookies(res, accessToken, refreshToken);

  // NOTE: need to uncomment before production
  // const url = `${req.protocol}://${req.get('host')}/me`;
  // await new SendEmail(user, url).sendWelcome();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: { accessToken, user },
  });
});

const login = catchAsync(async (req, res) => {
  const userInfo = await AuthServices.loginFromDB(req.body);

  const { refreshToken, accessToken, user } = userInfo;

  setResponseCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken, user },
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const userInfo = await AuthServices.updatePasswordIntoDB(req.user?._id, {
    currentPassword,
    newPassword,
  });

  const { refreshToken, accessToken, user } = userInfo;

  setResponseCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: { accessToken, user },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: token } = req.cookies;

  const userInfo = await AuthServices.getRefreshToken(token);

  const { accessToken, refreshToken, user } = userInfo;

  setResponseCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Refresh token retrieved successfully!',
    data: { accessToken, user },
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  await AuthServices.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Please check your email!',
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;

  const userInfo = await AuthServices.resetPasswordIntoDB(req.body, token);

  const { refreshToken, accessToken, user } = userInfo;

  setResponseCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful!',
    data: { accessToken, user },
  });
});

export const AuthControllers = {
  register,
  login,
  updatePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};

/*
http://localhost:3000/reset-password?id=67cebdba9b6aab2fc81513dd&passwordResetToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2NlYmRiYTliNmFhYjJmYzgxNTEzZGQiLCJlbWFpbCI6ImFidXJhaWhhbjg3MjFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDE2MDI0MTgsImV4cCI6MTc0MTYwMzAxOH0.WB7uOlyjiBNWk_3LTZjzHc7u5w-q9ySQIzmkc-cYq7w
*/
