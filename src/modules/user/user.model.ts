import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';

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
        default: [],
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
        default: [],
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
      enum: ['user', 'admin', 'superAdmin'],
      default: 'user',
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
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password as string, 8);
  }

  if (this.isModified('password') && !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

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
  return await this.findById(id).select('+password');
};

UserSchema.statics.isPasswordCorrect = async function (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  if (!plainTextPassword || !hashedPassword) {
    throw new Error(
      'Both plain text password and hashed password are required for comparison.',
    );
  }

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

//========= TRANSFORM ALL RETURN DOCUMENTS ========
// remove password (if exists) and __v from any return documents
UserSchema.set('toObject', {
  transform: (_doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const User = model<IUser, UserModel>('User', UserSchema);
