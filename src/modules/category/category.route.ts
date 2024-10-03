import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';
import { CategoryControllers } from './category.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);
router.get('/', CategoryControllers.getAllCategories);
router.get('/:id', CategoryControllers.getCategory);
router.delete('/:id', CategoryControllers.deleteCategory);
router.put('/:id', CategoryControllers.updateCategory);

export const CategoryRoutes = router;
