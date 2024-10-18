import express from 'express';
import { CommentControllers } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// UPDATE
router.patch(
  '/:id',
  auth(USER_ROLE.USER),
  CommentControllers.updateComment,
);

// GET ONE
router.get('/:id', CommentControllers.getComment);

// DELETE ONE
router.delete('/:id', CommentControllers.deleteComment);

export const CommentRoutes = router;
