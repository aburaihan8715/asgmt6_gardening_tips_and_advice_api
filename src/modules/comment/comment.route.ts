import express from 'express';
import { CommentControllers } from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth(USER_ROLE.user), CommentControllers.createComment)
  .get(CommentControllers.getAllComments);

router
  .route('/:id')
  .get(auth(USER_ROLE.user), CommentControllers.getSingleComment)
  .delete(
    auth(USER_ROLE.admin, USER_ROLE.user),
    CommentControllers.deleteComment,
  )
  .patch(auth(USER_ROLE.user), CommentControllers.updateComment);

export const CommentRoutes = router;
