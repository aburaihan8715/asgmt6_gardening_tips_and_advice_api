import { Types } from 'mongoose';
import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    user: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: 'Invalid user ID',
    }),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.enum(['Vegetables', 'Flowers', 'Landscaping', 'Others']),
    image: z.string().optional(),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    category: z
      .enum(['Vegetables', 'Flowers', 'Landscaping', 'Others'])
      .optional(),
    image: z.string().optional(),
  }),
});

export const PostValidations = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
