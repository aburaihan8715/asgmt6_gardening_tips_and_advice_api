import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// GET TOP 5 USERS
router.get(
  '/top-5-users',
  UserControllers.getAliasUsers,
  UserControllers.getAllUsers,
);

// GET ALL USERS
router.get('/', UserControllers.getAllUsers);

// GET ALL ADMINS
router.get('/admins', auth(USER_ROLE.admin), UserControllers.getAllAdmins);

// GET ONE USER
router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getMe,
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

// Add favorite
router.patch(
  '/:postId/add-favourites',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.addFavourite,
);

// Remove favorite
router.patch(
  '/:postId/remove-favourites',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.removeFavourite,
);

// Check premium status
router.get(
  '/check-premium-status',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.checkPremiumStatus,
);

// Get favourite posts
router.get(
  '/favourite-posts',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getFavouritePosts,
);

// Get user stats
router.get(
  '/user-stats',
  auth(USER_ROLE.admin),
  UserControllers.getUserStats,
);

// GET SINGLE USER
router.get('/:id', UserControllers.getSingleUser);

// Delete User
router.delete('/:id', auth(USER_ROLE.admin), UserControllers.deleteUser);
// Get revenue
router.get('/revenue', auth(USER_ROLE.admin), UserControllers.getRevenue);

export const UserRoutes = router;
