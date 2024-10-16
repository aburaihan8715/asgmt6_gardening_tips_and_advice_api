import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// GET ALL USERS
router.get('/', auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);

// GET ALL ADMINS
router.get('/admins', auth(USER_ROLE.ADMIN), UserControllers.getAllAdmins);

// GET ONE USER
router.get(
  '/me',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.getMe,
);

router.patch(
  '/:id/follow',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.followUser,
);

router.patch(
  '/:id/unfollow',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.unfollowUser,
);

// Add favorite
router.patch(
  '/:postId/add-favourites',
  auth(USER_ROLE.USER),
  UserControllers.addFavourite,
);

// Remove favorite
router.patch(
  '/:postId/remove-favourites',
  auth(USER_ROLE.USER),
  UserControllers.removeFavourite,
);

export const UserRoutes = router;
