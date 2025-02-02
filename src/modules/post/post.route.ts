import express, { NextFunction, Request, Response } from 'express';
import { PostControllers } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';
import AppError from '../../errors/AppError';
import { CommentRoutes } from '../comment/comment.route';

const router = express.Router();
// NOTE: This is for merge params
router.use('/:postId/comments', CommentRoutes);

// CREATE
router.post(
  '/',
  auth(USER_ROLE.user),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (err) {
      next(new AppError(400, 'Invalid JSON data'));
    }
  },
  validateRequest(PostValidations.createPostValidationSchema),
  PostControllers.createPost,
);

// UPDATE
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (err) {
      next(new AppError(400, 'Invalid JSON data'));
    }
  },
  validateRequest(PostValidations.updatePostValidationSchema),
  PostControllers.updatePost,
);

// GET NEW 5
router.get(
  '/top-5-posts',
  PostControllers.getAliasPosts,
  PostControllers.getAllPosts,
);

// GET ALL
router.get('/', PostControllers.getAllPosts);

// GET MY POSTS
router.get('/my-posts', auth(USER_ROLE.user), PostControllers.getMyPosts);

// Get post stats
router.get(
  '/post-stats',
  auth(USER_ROLE.admin),
  PostControllers.getPostStats,
);

// DELETE ONE
router.delete(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.admin),
  PostControllers.deletePost,
);

// MAKE PREMIUM
router.patch(
  '/:id/make-premium',
  auth(USER_ROLE.user),
  PostControllers.makePremiumPost,
);

// Upvote a post
router.patch(
  '/:id/upvote',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.upvote,
);

// Downvote a post
router.patch(
  '/:id/downvote',
  auth(USER_ROLE.admin, USER_ROLE.user),
  PostControllers.downvote,
);

// Get post stats
router.get(
  '/post-stats',
  auth(USER_ROLE.admin),
  PostControllers.getPostStats,
);

// GET ONE
router.get('/:id', PostControllers.getPost);

export const PostRoutes = router;
