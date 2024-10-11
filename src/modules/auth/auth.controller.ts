import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const registerUser = catchAsync(async (req, res) => {
  const newUser = await AuthServices.registerIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: newUser,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const userInfo = await AuthServices.loginFromDB(req.body);

  const { refreshToken, accessToken, user } = userInfo;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken, refreshToken, user },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const id = req.user?._id;

  const result = await AuthServices.changePasswordIntoDB(id, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  });
});

const accessTokenByRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result =
    await AuthServices.accessTokenByRefreshTokenFromServer(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token by refresh token is retrieved successfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await AuthServices.forgetPasswordByEmail(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  // console.log(token);

  const result = await AuthServices.resetPasswordIntoDB(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful!',
    data: result,
  });
});

const settingsProfile = catchAsync(async (req, res) => {
  // console.log(JSON.parse(req.body.data));
  // console.log(req.file);
  const id = req.user._id;
  const userInfo = await AuthServices.settingsProfileIntoDB(id, {
    ...JSON.parse(req.body.data),
    profilePicture: req.file?.path,
  });

  const { refreshToken, accessToken, user } = userInfo;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Settings updated successfully',
    data: { accessToken, refreshToken, user },
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
  changePassword,
  accessTokenByRefreshToken,
  forgetPassword,
  resetPassword,
  settingsProfile,
};
