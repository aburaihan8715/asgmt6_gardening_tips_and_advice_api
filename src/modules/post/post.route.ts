import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';
import { PostControllers } from './post.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(PostValidations.createPostValidationSchema),
  PostControllers.createPost,
);
router.get('/', PostControllers.getAllPosts);
router.get('/:id', PostControllers.getPost);
router.delete('/:id', PostControllers.deletePost);
router.put('/:id', PostControllers.updatePost);

export const PostRoutes = router;
