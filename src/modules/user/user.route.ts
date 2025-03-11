import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserMiddleware } from './user.middleware';
import { UserValidation } from './user.validation';
import userFileUpload from './user.fileUpload';
import parseString from '../../middlewares/parseString';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getMe,
);

router.patch(
  '/update-me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  userFileUpload.single('file'),
  parseString(),
  validateRequest(UserValidation.updateMeValidation),
  UserControllers.updateMe,
);

router.delete(
  '/delete-me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.deleteMe,
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

// NOTE: always keep specific path above
router.get(
  '/top-5-users',
  UserMiddleware.getAliasUsers,
  UserControllers.getAllUsers,
);
router.post('/', auth(USER_ROLE.admin), UserControllers.createUser);
router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUsers);
router.get('/:id', auth(USER_ROLE.admin), UserControllers.getSingleUser);
router.delete('/:id', auth(USER_ROLE.admin), UserControllers.deleteUser);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  userFileUpload.single('file'),
  parseString(),
  UserControllers.updateUser,
);

router.get('/revenue', auth(USER_ROLE.admin), UserControllers.getRevenue);

export const UserRoutes = router;
