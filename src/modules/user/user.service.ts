import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import { Post } from '../post/post.model';

// GET ALL USERS
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

// GET ALL ADMINS
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

// GET ONE USER
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

// FOLLOW
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

  // console.log('current user🔥', currentUser);
  // console.log('postUser user🔥', postUser);

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

// UN FOLLOW
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

// ADD FAVORITE
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

// REMOVE FAVORITE
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

// CHECK PREMIUM
const checkPremiumStatusIntoDB = async (userId: string) => {
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

  console.log('hasUpvotedPosts', hasUpvotedPosts);

  return !!hasUpvotedPosts;
};

// GET FAVOURITE POSTS
const getFavouritePostsFromDB = async (userId: string) => {
  // Step 1: Fetch the user by ID
  const user = await User.getUserById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Step 2: Check if the user has any favourite posts
  const favouritePosts = await Post.find({
    _id: { $in: user.favourites },
    isDeleted: false,
  });

  // Step 3: Return the list of favourite posts or empty array if none exist
  return favouritePosts;
};

export const UserServices = {
  getAllUsersFromDB,
  getAllAdminsFromDB,
  followUserIntoDB,
  unfollowUserIntoDB,
  addFavouriteIntoDB,
  removeFavouriteIntoDB,
  getMeFromDB,
  checkPremiumStatusIntoDB,
  getFavouritePostsFromDB,
};
