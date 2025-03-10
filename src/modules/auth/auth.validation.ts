import { z } from 'zod';

const registerValidationSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: 'Username is required',
      })
      .min(1, { message: 'Username cannot be empty' })
      .trim(),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email address' })
      .trim(),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters long' }),

    profilePicture: z.string().optional(),

    followers: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'))
      .optional(),

    followings: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'))
      .optional(),

    verified: z.boolean().optional(),

    role: z.enum(['USER', 'ADMIN', 'VERIFIED_USER']).optional(),

    favourites: z
      .array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID'))
      .optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email({ message: 'Invalid email address' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const updatePasswordValidation = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z.string({ required_error: 'New password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User email is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

export const AuthValidations = {
  registerValidationSchema,
  loginValidationSchema,
  updatePasswordValidation,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
