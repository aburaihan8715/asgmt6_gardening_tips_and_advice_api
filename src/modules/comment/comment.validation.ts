import { z } from 'zod';

const createCommentSchema = z.object({
  body: z.object({
    post: z.string().min(1, 'Post ID is required'),
    user: z.string().min(1, 'User ID is required'),
    content: z.string().min(1, 'Content is required'),
  }),
});
const updateCommentSchema = z.object({
  body: z.object({
    post: z.string().min(1, 'Post ID is required'),
    user: z.string().min(1, 'User ID is required'),
    content: z.string().min(1, 'Content is required'),
  }),
});

export const CommentValidations = {
  createCommentSchema,
  updateCommentSchema,
};
