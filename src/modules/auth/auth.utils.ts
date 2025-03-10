import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import config from '../../config';
import { IUser } from '../user/user.interface';
import { Response } from 'express';

export const createToken = (
  jwtPayload: object,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const decodeToken = async (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    console.log('Error while decoding token!', error);
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Error while decoding token!',
    );
  }
};

export const getTokens = (user: IUser) => {
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
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

  const passwordResetToken = createToken(
    jwtPayload,
    config.jwt_password_reset_secret as string,
    config.jwt_password_reset_expires_in as string,
  );

  return { accessToken, refreshToken, passwordResetToken };
};

export const setResponseCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  // NOTE: in cookies maxAge take number and expires take date we can use any one
  res.cookie('accessToken', accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    // maxAge: 1000 * 60 * 60 * 24 * 365,
    // sameSite: true,
  });

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    // maxAge: 1000 * 60 * 60 * 24 * 365,
    // sameSite: true,
  });
};
