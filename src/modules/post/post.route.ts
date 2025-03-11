import express from 'express';
import { PostControllers } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';

import { CommentRoutes } from '../comment/comment.route';
import postFileUpload from './post.fileUpload';
import parseString from '../../middlewares/parseString';
import { PostMiddleware } from './post.middleware';

const router = express.Router();
// NOTE: This is for merge params
router.use('/:postId/comments', CommentRoutes);

router.get('/my-posts', auth(USER_ROLE.user), PostControllers.getMyPosts);

router.get(
  '/post-stats',
  auth(USER_ROLE.admin),
  PostControllers.getPostStats,
);

router.patch(
  '/:id/make-premium',
  auth(USER_ROLE.user),
  PostControllers.makePremiumPost,
);

router.patch(
  '/:id/upvote',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.upvote,
);

router.patch(
  '/:id/downvote',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.downvote,
);

router.get(
  '/post-stats',
  auth(USER_ROLE.admin),
  PostControllers.getPostStats,
);

router.get(
  '/top-5-posts',
  PostMiddleware.getAliasPosts,
  PostControllers.getAllPosts,
);

router.post(
  '/',
  auth(USER_ROLE.user),
  postFileUpload.single('file'),
  parseString(),
  validateRequest(PostValidations.createPostValidationSchema),
  PostControllers.createPost,
);
router.get('/', PostControllers.getAllPosts);
router.get('/:id', PostControllers.getPost);
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  postFileUpload.single('file'),
  parseString(),
  validateRequest(PostValidations.updatePostValidationSchema),
  PostControllers.updatePost,
);

router.delete(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.deletePost,
);

export const PostRoutes = router;
