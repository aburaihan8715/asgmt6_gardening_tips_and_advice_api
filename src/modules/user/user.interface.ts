import { Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  profilePicture?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  verified: boolean;
  role: 'USER' | 'ADMIN' | 'VERIFIED_USER';
  favourites: Types.ObjectId[];
  __v?: number;
}

export interface UserModel extends Model<IUser> {
  getUserByEmail(email: string): Promise<IUser>;
  isPasswordCorrect(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
