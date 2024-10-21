import express, { NextFunction, Request, Response } from 'express';
import { PostControllers } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';
import AppError from '../../errors/AppError';

const router = express.Router();

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

// GET ONE
router.get('/:id', auth(USER_ROLE.user), PostControllers.getPost);

// DELETE ONE
router.delete('/:id', auth(USER_ROLE.user), PostControllers.deletePost);

// MAKE PREMIUM
router.patch(
  '/:id/make-premium',
  auth(USER_ROLE.admin),
  PostControllers.makePremiumPost,
);

// Upvote a post
router.patch('/:id/upvote', auth(USER_ROLE.user), PostControllers.upvote);

// Downvote a post
router.patch(
  '/:id/downvote',
  auth(USER_ROLE.user),
  PostControllers.downvote,
);

// Create comment
router.post(
  '/:id/comments',
  auth(USER_ROLE.user),
  PostControllers.addComment,
);

// Get comments of a post
router.get('/:id/comments', PostControllers.getComments);

export const PostRoutes = router;
