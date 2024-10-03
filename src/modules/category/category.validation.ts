import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Category name is required',
      })
      .min(1, { message: 'Category name cannot be empty' })
      .trim(),
  }),
});
const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Category name is required',
      })
      .min(1, { message: 'Category name cannot be empty' })
      .trim()
      .optional(),
  }),
});

export const CategoryValidations = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
