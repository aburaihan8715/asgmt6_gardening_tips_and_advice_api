import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidations } from './comment.validation';
import { CommentControllers } from './comment.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(CommentValidations.createCommentValidationSchema),
  CommentControllers.createComment,
);
router.get('/', CommentControllers.getAllComments);
router.get('/:id', CommentControllers.getComment);
router.delete('/:id', CommentControllers.deleteComment);
router.put('/:id', CommentControllers.updateComment);

export const CommentRoutes = router;
