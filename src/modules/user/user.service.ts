import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import { Post } from '../post/post.model';
import config from '../../config';

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(User.find(), query)
    .search(['username', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await UserQuery.modelQuery;
  const meta = await UserQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const AdminQuery = new QueryBuilder(User.find(), query)
    .search(['username', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AdminQuery.modelQuery;
  const meta = await AdminQuery.countTotal();

  return {
    meta,
    result,
  };
};

// NOTE: in get me should not use id
const getMeFromDB = async (id: string) => {
  const result = await User.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }

  if (result && result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User has been deleted!');
  }
  return result;
};

const getSingleUserFromDB = async (userId: string) => {
  const result = await User.findById(userId);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found !');
  }

  if (result && result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User has been deleted!');
  }
  return result;
};

const followUserIntoDB = async (
  currentUserId: string,
  postUserId: string,
) => {
  if (!currentUserId || !postUserId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  if (currentUserId === postUserId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can not follow yourself !',
    );
  }

  const currentUser = await User.getUserById(currentUserId);
  const postUser = await User.getUserById(postUserId);

  if (!currentUser || !postUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (postUser.followers.includes(currentUser._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You already follow this user!',
    );
  }

  await currentUser.updateOne({
    $push: { followings: postUserId },
    $inc: { followingsCount: 1 },
  });
  await postUser.updateOne({
    $push: { followers: currentUserId },
    $inc: { followersCount: 1 },
  });

  return null;
};

const unfollowUserIntoDB = async (
  currentUserId: string,
  postUserId: string,
) => {
  if (!currentUserId || !postUserId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  if (currentUserId === postUserId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You cannot unfollow yourself!',
    );
  }

  const currentUser = await User.getUserById(currentUserId);
  const postUser = await User.getUserById(postUserId);

  if (!currentUser || !postUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (!postUser.followers.includes(currentUser._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can not unfollow this user!',
    );
  }

  // Unfollow logic
  await currentUser.updateOne({
    $pull: { followings: postUserId },
    $inc: { followingsCount: -1 },
  });
  await postUser.updateOne({
    $pull: { followers: currentUserId },
    $inc: { followersCount: -1 },
  });

  return null;
};

const addFavouriteIntoDB = async (
  currentUserId: string,
  postId: string,
) => {
  if (!currentUserId || !postId) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User Id OR Post ID not found!',
    );
  }

  const currentUser = await User.getUserById(currentUserId);
  const post = await Post.getPostById(postId);

  if (!currentUser || !post) {
    throw new AppError(httpStatus.NOT_FOUND, 'User OR Post not found!');
  }

  if (!currentUser.favourites.includes(post._id)) {
    await currentUser.updateOne({ $push: { favourites: post._id } });
  }

  return null;
};

const removeFavouriteIntoDB = async (
  currentUserId: string,
  postId: string,
) => {
  if (!currentUserId || !postId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  const currentUser = await User.getUserById(currentUserId);
  const post = await Post.getPostById(postId);

  if (!currentUser || !post) {
    throw new AppError(httpStatus.NOT_FOUND, 'User OR Post not found!');
  }

  if (currentUser.favourites.includes(post._id)) {
    await currentUser.updateOne({ $pull: { favourites: post._id } });
  }

  return null;
};

const checkHasUpvoteForPostIntoDB = async (userId: string) => {
  const user = await User.getUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Check if any posts exist with at least 1 upvote
  const hasUpvotedPosts = await Post.exists({
    user: user._id,
    upvotesCount: { $gte: 1 },
    // isVerified: false,
  });

  return !!hasUpvotedPosts;
};

const getFavouritePostsFromDB = async (userId: string) => {
  const user = await User.getUserById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const favouritePosts = await Post.find({
    _id: { $in: user.favourites },
    isDeleted: false,
  });

  return favouritePosts;
};

const getUserStatsFromDB = async () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const previousYear = currentYear - 1;

  const data = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${previousYear}-01-01`),
          $lte: new Date(`${previousYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        numberOfUsers: { $sum: 1 },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { month: 1 },
    },
  ]);
  return data;
};

const getRevenueFromDB = async () => {
  const feePerSubscription = Number(config.subscription_price);

  const data = await User.aggregate([
    {
      $match: {
        isVerified: true,
      },
    },
    {
      $group: {
        _id: null,
        numberOfUsers: { $sum: 1 },
        totalRevenue: { $sum: feePerSubscription },
      },
    },
    {
      $project: { _id: 0, numberOfUsers: 1, totalRevenue: 1 },
    },
  ]);

  return data;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Mark all posts by this user as deleted
  await Post.updateMany({ user: id }, { isDeleted: true });

  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getAllAdminsFromDB,
  followUserIntoDB,
  unfollowUserIntoDB,
  addFavouriteIntoDB,
  removeFavouriteIntoDB,
  getMeFromDB,
  checkHasUpvoteForPostIntoDB,
  getFavouritePostsFromDB,
  getUserStatsFromDB,
  getRevenueFromDB,
  deleteUserFromDB,
  getSingleUserFromDB,
};
