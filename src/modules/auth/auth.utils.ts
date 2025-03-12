import httpStatus from 'http-status';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import config from '../../config';
import { IUser } from '../user/user.interface';
import { Response } from 'express';

export const createToken = (
  payload: JwtPayload,
  secret: string,
  expireTime: SignOptions['expiresIn'] = '1h',
): string => {
  try {
    return jwt.sign(payload, secret, { expiresIn: expireTime });
  } catch (error) {
    console.error('Error while creating token:', error);
    throw error;
  }
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
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  );

  const passwordResetToken = createToken(
    jwtPayload,
    config.jwt_password_reset_secret as string,
    config.jwt_password_reset_expires_in as SignOptions['expiresIn'],
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
