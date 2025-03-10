import httpStatus from 'http-status';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import { ILogin } from './auth.interface';
import { decodeToken, getTokens } from './auth.utils';
import config from '../../config';
import SendEmail from '../../email/SendEmail';

const registerIntoDB = async (payload: IUser) => {
  const user = await User.create(payload);

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to cerate user. Try again!',
    );
  }

  const { accessToken, refreshToken } = getTokens(user);

  if (!accessToken || !refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You must need accessToken and refreshToken !',
    );
  }

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const loginFromDB = async (payload: ILogin) => {
  const user = await User.getUserByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const isPasswordCorrect = await User.isPasswordCorrect(
    payload?.password,
    user?.password as string,
  );

  if (!isPasswordCorrect) throw new AppError(400, 'Wrong credentials!');

  const { accessToken, refreshToken } = getTokens(user);

  if (!accessToken || !refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You must need accessToken and refreshToken !',
    );
  }

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const updatePasswordIntoDB = async (
  id: string,
  payload: { currentPassword: string; newPassword: string },
) => {
  const user = await User.getUserById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User already deleted !');
  }

  const isPasswordCorrect = await User.isPasswordCorrect(
    payload.currentPassword,
    user?.password as string,
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  // const newHashedPassword = await bcrypt.hash(
  //   payload.newPassword,
  //   Number(config.bcrypt_salt_rounds),
  // );

  // await User.findByIdAndUpdate(id, {
  //   password: newHashedPassword,
  //   passwordChangedAt: new Date(),
  // });

  user.password = payload.newPassword;
  await user.save();
  const { accessToken, refreshToken } = getTokens(user);

  if (!accessToken || !refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You must need accessToken and refreshToken !',
    );
  }

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const getRefreshToken = async (token: string) => {
  const decoded = await decodeToken(
    token,
    config.jwt_refresh_secret as string,
  );

  const { _id, iat } = decoded;

  const user = await User.getUserById(_id);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'The user belonging to this token does no longer exist!',
    );
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User already deleted !');
  }

  if (
    user.passwordChangedAt &&
    User.isPasswordChangedAfterJwtIssued(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'User recently changed password! Please login again.',
    );
  }

  const { accessToken, refreshToken } = getTokens(user);

  if (!accessToken || !refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You must need accessToken and refreshToken !',
    );
  }

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const forgetPassword = async (email: string) => {
  // check user exists
  const user = await User.getUserByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }
  // check user already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User already deleted !');
  }

  const { passwordResetToken } = getTokens(user);

  const passwordResetUILink = `${config.reset_pass_ui_link}?id=${user._id}&passwordResetToken=${passwordResetToken}`;

  await new SendEmail(user, passwordResetUILink).sendPasswordReset();
  return null;
};

const resetPasswordIntoDB = async (
  payload: { id: string; newPassword: string },
  passwordResetToken: string,
) => {
  const user = await User.getUserById(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const decoded = await decodeToken(
    passwordResetToken,
    config.jwt_password_reset_secret as string,
  );

  if (payload.id !== decoded._id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are unauthorized!');
  }

  user.password = payload.newPassword;
  await user.save();
  const { accessToken, refreshToken } = getTokens(user);

  if (!accessToken || !refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You must need accessToken and refreshToken !',
    );
  }

  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const AuthServices = {
  registerIntoDB,
  loginFromDB,
  updatePasswordIntoDB,
  getRefreshToken,
  forgetPassword,
  resetPasswordIntoDB,
};
