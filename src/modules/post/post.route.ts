import express, { NextFunction, Request, Response } from 'express';
// import validateRequest from '../../middlewares/validateRequest';
// import { PostValidations } from './post.validation';
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

export const PostRoutes = router;
