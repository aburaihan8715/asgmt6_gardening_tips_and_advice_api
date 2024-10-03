import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    user: z.string().min(1, 'User ID is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.enum(['Vegetables', 'Flowers', 'Landscaping', 'Others']),
    image: z.string().optional(),
    premium: z.boolean().optional().default(false),
    upvotes: z.array(z.string()).optional().default([]),
    downvotes: z.array(z.string()).optional().default([]),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    user: z.string().min(1, 'User ID is required').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    category: z
      .enum(['Vegetables', 'Flowers', 'Landscaping', 'Others'])
      .optional(),
    image: z.string().optional(),
    premium: z.boolean().optional().default(false),
    upvotes: z.array(z.string()).optional().default([]),
    downvotes: z.array(z.string()).optional().default([]),
  }),
});

export const PostValidations = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
