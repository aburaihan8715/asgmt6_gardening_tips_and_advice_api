import httpStatus from 'http-status';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import { ILogin } from './auth.interface';
import { createToken, decodeToken } from './auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../utils/sendEmail';

// REGISTER
const registerIntoDB = async (payload: IUser) => {
  let newUser = await User.create(payload);

  if (!newUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to cerate user. Try again!',
    );
  }
  newUser = newUser.toObject();
  delete newUser.password;
  delete newUser.__v;

  return newUser;
};

// LOGIN
const loginFromDB = async (payload: ILogin) => {
  // 01. checking if the user is exist
  let user = await User.getUserByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // 02. checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // 03. checking if the password is correct
  const isPasswordCorrect = await User.isPasswordCorrect(
    payload?.password,
    user?.password as string,
  );
  if (!isPasswordCorrect) throw new AppError(400, 'Wrong credentials!');

  // 04. create accessToken and refreshToken
  const jwtPayload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    followers: user.followers,
    following: user.following,
    role: user.role,
    favourites: user.favourites,
    isVerified: user.isVerified,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  // 05. delete password form the user
  user = user.toObject();
  delete user.password;
  delete user.__v;

  // 06. return tokens and user to the controller
  return {
    accessToken,
    refreshToken,
    user,
  };
};

// CHANGE PASSWORD
const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  // 01 check user exists
  const user = await User.getUserByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }

  // 02 check user is deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User already deleted !');
  }

  // 03 check password correct
  const isPasswordCorrect = await User.isPasswordCorrect(
    payload.currentPassword,
    user?.password as string,
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  // 04 hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // 05 update the new password
  await User.findByIdAndUpdate(userData._id, {
    password: newHashedPassword,
    passwordChangedAt: new Date(),
  });

  // 06 finally return null
  return null;
};

// GET ACCESS TOKEN BY REFRESH TOKEN
const accessTokenByRefreshTokenFromServer = async (
  refreshToken: string,
) => {
  // 01 decode the giver token
  const decoded = await decodeToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  );

  const { _id, iat } = decoded;

  // 02 check user exists
  const user = await User.getUserById(_id);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'The user belonging to this token does no longer exist!',
    );
  }
  // 03 check user is deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User already deleted !');
  }

  // 04 check password changed after jwt issued
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

  // 05 create access token
  const jwtPayload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    followers: user.followers,
    following: user.following,
    role: user.role,
    favourites: user.favourites,
    isVerified: user.isVerified,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // 06 return the access token
  return {
    accessToken,
  };
};

// FORGET PASSWORD
const forgetPasswordByEmail = async (email: string) => {
  // 01 check user exists
  const user = await User.getUserByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }
  // 02 check user already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User already deleted !');
  }

  // 03 create password reset token
  const jwtPayload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    followers: user.followers,
    following: user.following,
    role: user.role,
    favourites: user.favourites,
    isVerified: user.isVerified,
  };

  const passwordResetToken = createToken(
    jwtPayload,
    config.jwt_password_reset_secret as string,
    config.jwt_password_reset_expires_in as string,
  );

  // 04 send the reset token to the user email
  const passwordResetUILink = `${config.reset_pass_ui_link}?id=${user._id}&passwordResetToken=${passwordResetToken} `;
  sendEmail(user.email, passwordResetUILink);
};

// RESET PASSWORD
const resetPasswordIntoDB = async (
  payload: { id: string; newPassword: string },
  passwordResetToken: string,
) => {
  // 01 check user exists
  const user = await User.getUserById(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }

  // 02 check user already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // 03 decode the token and check it
  const decoded = await decodeToken(
    passwordResetToken,
    config.jwt_password_reset_secret as string,
  );

  if (payload.id !== decoded._id) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  // 04 hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  //  05 update the password field
  await User.findByIdAndUpdate(decoded._id, {
    password: newHashedPassword,
    passwordChangedAt: new Date(),
  });
};

export const AuthServices = {
  registerIntoDB,
  loginFromDB,
  changePasswordIntoDB,
  accessTokenByRefreshTokenFromServer,
  forgetPasswordByEmail,
  resetPasswordIntoDB,
};

// http://localhost:3000/reset-password?id=6702307cc0ceb8346af92d61&passwordResetToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzAyMzA3Y2MwY2ViODM0NmFmOTJkNjEiLCJ1c2VybmFtZSI6IkFidSBSYWloYW4iLCJlbWFpbCI6ImFidXJhaWhhbjg3MjFAZ21haWwuY29tIiwicHJvZmlsZVBpY3R1cmUiOiIiLCJmb2xsb3dlcnMiOltdLCJmb2xsb3dpbmciOltdLCJyb2xlIjoiVVNFUiIsImZhdm91cml0ZXMiOltdLCJpc1ZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNzI4MjA5NTg0LCJleHAiOjE3MjgyMTAxODR9.Kh1OplfNKvKRPaTypeHN8SS2hiy98Cvm9KziFum1dco
