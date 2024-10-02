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
      // 01 check token
      let token = '';
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You have no token, please login again!',
        );
      }

      // 02 verify the token
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const { role, email, iat } = decoded;

      // 03 check user still exists
      const user = await User.getUserByEmail(email);

      if (!user) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'The user belonging to this token does no longer exist!',
        );
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

      // 05 check authorization if needed
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'You have no access to this route!',
        );
      }

      // 06 set user in the request
      req.user = decoded as JwtPayload;

      // 07 grand access the user!!
      next();
    },
  );
};

export default auth;
