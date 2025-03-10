import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserMiddleware } from './user.middleware';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post('/', UserControllers.createUser);
router.get('/', UserControllers.getAllUsers);
router.get('/:id', UserControllers.getSingleUser);
router.delete('/:id', auth(USER_ROLE.admin), UserControllers.deleteUser);
router.patch('/:id', auth(USER_ROLE.admin), UserControllers.updateUser);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getMe,
);

router.patch(
  '/update-me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  multerUpload.single('file'),
  validateRequest(UserValidation.updateMeValidation),
  UserControllers.updateMe,
);

router.get(
  '/delete-me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.deleteMe,
);

router.get(
  '/top-5-users',
  UserMiddleware.getAliasUsers,
  UserControllers.getAllUsers,
);

router.patch(
  '/:id/follow',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.followUser,
);

router.patch(
  '/:id/unfollow',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.unfollowUser,
);

router.patch(
  '/:postId/add-favourites',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.addFavourite,
);

router.patch(
  '/:postId/remove-favourites',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.removeFavourite,
);

router.get(
  '/check-has-upvote-for-post',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.checkHasUpvoteForPost,
);

router.get(
  '/favourite-posts',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getFavouritePosts,
);

router.get(
  '/user-stats',
  auth(USER_ROLE.admin),
  UserControllers.getUserStats,
);

router.get('/revenue', auth(USER_ROLE.admin), UserControllers.getRevenue);

export const UserRoutes = router;
