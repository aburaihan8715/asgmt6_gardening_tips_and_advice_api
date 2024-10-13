import { Document, Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  passwordChangedAt?: Date;
  profilePicture?: string;
  followers: Types.ObjectId[];
  followersCount: number;
  followings: Types.ObjectId[];
  followingsCount: number;
  isVerified: boolean;
  isDeleted: boolean;
  role: 'USER' | 'ADMIN';
  favourites: Types.ObjectId[];
  __v?: number;
}

export interface UserModel extends Model<IUser> {
  getUserByEmail(email: string): Promise<IUser>;
  getUserById(id: string): Promise<IUser>;
  isPasswordCorrect(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isPasswordChangedAfterJwtIssued(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
