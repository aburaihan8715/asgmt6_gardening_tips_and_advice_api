import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    postId: z.string().min(1, 'Post ID is required'),
    userId: z.string().min(1, 'User ID is required'),
    content: z.string().min(1, 'Content is required'),
    upvotes: z.array(z.string()).optional().default([]),
    downvotes: z.array(z.string()).optional().default([]),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    postId: z.string().optional(),
    userId: z.string().optional(),
    content: z.string().optional(),
    upvotes: z.array(z.string()).optional().default([]),
    downvotes: z.array(z.string()).optional().default([]),
  }),
});

export const CommentValidations = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};
