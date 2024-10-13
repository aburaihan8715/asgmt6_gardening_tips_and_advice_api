import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true, // Index for faster queries
    },
    password: {
      type: String,
      required: true,
      select: false, // Exclude password by default
    },
    passwordChangedAt: {
      type: Date,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
    },
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followingsCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    favourites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

// DOCUMENT MIDDLEWARE
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash password with bcrypt
  this.password = await bcrypt.hash(
    this.password as string,
    Number(config.bcrypt_salt_rounds) || 10, // Fallback if salt_rounds is not provided
  );
  next();
});

// STATIC METHODS
UserSchema.statics.getUserByEmail = async function (
  email: string,
): Promise<IUser | null> {
  return await this.findOne({ email }).select('+password');
};

UserSchema.statics.getUserById = async function (
  id: string,
): Promise<IUser | null> {
  return await this.findById(id);
};

UserSchema.statics.isPasswordCorrect = async function (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

UserSchema.statics.isPasswordChangedAfterJwtIssued = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
): boolean {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>('User', UserSchema);
