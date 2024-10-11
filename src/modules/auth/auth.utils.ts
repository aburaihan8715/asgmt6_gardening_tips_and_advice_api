import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';

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
    console.log('Decode token error', error);
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Error while decoding token!',
    );
  }
};
