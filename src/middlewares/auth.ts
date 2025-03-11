import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';
import config from '../config';
import { User } from '../modules/user/user.model';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // check token
      let accessToken = null;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        accessToken = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.accessToken) {
        accessToken = req.cookies.accessToken;
      }

      if (!accessToken) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You have no token, please login again!',
        );
      }

      // verify the token
      const decoded = jwt.verify(
        accessToken,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const { role, email, iat } = decoded;

      // check user still exists
      const user = await User.getUserByEmail(email);

      if (!user) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'The user belonging to this token does no longer exist!',
        );
      }

      // check user already deleted
      const isDeleted = user?.isDeleted;

      if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
      }

      // check password changed after jwt issued
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

      // check authorization if needed
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You have no access to this route!',
        );
      }

      // set user in the request
      req.user = decoded as JwtPayload;

      // grand access the user!!
      next();
    },
  );
};

export default auth;
