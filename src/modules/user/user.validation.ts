import { z } from 'zod';

const updateMeValidation = z.object({
  body: z.object({
    username: z
      .string({
        required_error: 'Username is required',
      })
      .min(1, { message: 'Username cannot be empty' })
      .trim()
      .optional(),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email address' })
      .trim()
      .optional(),

    profilePicture: z.string().optional(),
  }),
});

export const UserValidation = {
  updateMeValidation,
};
