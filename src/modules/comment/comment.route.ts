import express from 'express';
import { CommentControllers } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// UPDATE
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  CommentControllers.updateComment,
);

// GET ONE
router.get('/:id', auth(USER_ROLE.user), CommentControllers.getComment);

// DELETE ONE
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  CommentControllers.deleteComment,
);

export const CommentRoutes = router;
