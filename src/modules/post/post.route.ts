import express, { NextFunction, Request, Response } from 'express';
import { PostControllers } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';

const router = express.Router();

// CREATE
router.post(
  '/',
  auth(USER_ROLE.USER),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(PostValidations.createPostValidationSchema),
  PostControllers.createPost,
);

// UPDATE
router.patch(
  '/:id',
  auth(USER_ROLE.USER),
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(PostValidations.updatePostValidationSchema),
  PostControllers.updatePost,
);

// GET NEW 5
router.get(
  '/new-5-posts',
  PostControllers.getAliasPosts,
  PostControllers.getAllPosts,
);

// GET ALL
router.get('/', PostControllers.getAllPosts);

// GET MY POSTS
router.get('/my-posts', auth(USER_ROLE.USER), PostControllers.getMyPosts);

// GET ONE
router.get('/:id', PostControllers.getPost);

// DELETE ONE
router.delete('/:id', PostControllers.deletePost);

// MAKE PREMIUM
router.patch('/:id/make-premium', PostControllers.deletePost);

// Upvote a post
router.patch(
  '/:id/upvote',
  auth(USER_ROLE.USER),
  PostControllers.upvotePost,
);

// Downvote a post
router.patch(
  '/:id/downvote',
  auth(USER_ROLE.USER),
  PostControllers.downvotePost,
);

// Remove upvote
router.patch(
  '/:id/upvote/remove',
  auth(USER_ROLE.USER),
  PostControllers.removeUpvote,
);

// Remove downvote
router.patch(
  '/:id/downvote/remove',
  auth(USER_ROLE.USER),
  PostControllers.removeDownvote,
);

// NOTE: :id means post id
router.post(
  '/:id/comments',
  auth(USER_ROLE.USER),
  PostControllers.addComment,
);
router.get(
  '/:id/comments',
  auth(USER_ROLE.USER),
  PostControllers.getComments,
);

export const PostRoutes = router;
