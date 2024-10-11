import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { User } from './user.model';

// GET ALL
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

// GET ALL ADMIN
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

  if (!currentUser || !postUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (postUser.followers.includes(currentUser._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You already follow this user!',
    );
  }

  await currentUser.updateOne({ $push: { followings: postUserId } });
  await postUser.updateOne({ $push: { followers: currentUserId } });

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
  await currentUser.updateOne({ $pull: { followings: postUserId } });
  await postUser.updateOne({ $pull: { followers: currentUserId } });
  return null;
};

export const UserServices = {
  getAllUsersFromDB,
  getAllAdminsFromDB,
  followUserIntoDB,
  unfollowUserIntoDB,
};
