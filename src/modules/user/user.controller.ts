import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { UserServices } from './user.service';

// GET ALL USERS
const getAllUsers = catchAsync(async (req, res) => {
  const query = { ...req.query, isDeleted: { $ne: true } };
  const result = await UserServices.getAllUsersFromDB(query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// GET ALL ADMINS
const getAllAdmins = catchAsync(async (req, res) => {
  const query = { ...req.query, isDeleted: { $ne: true }, role: 'ADMIN' };
  const result = await UserServices.getAllUsersFromDB(query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// GET ONE USER
const getMe = catchAsync(async (req, res) => {
  const id = req.user._id;
  const user = await UserServices.getMeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: user,
  });
});

// FOLLOW USER
const followUser = catchAsync(async (req, res) => {
  const currentUserId = req.user._id;
  const postUserId = req.params.id;

  const result = await UserServices.followUserIntoDB(
    currentUserId,
    postUserId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Follow success!',
    data: result,
  });
});

// UN FOLLOW USER
const unfollowUser = catchAsync(async (req, res) => {
  const currentUserId = req.user._id;
  const postUserId = req.params.id;
  const result = await UserServices.unfollowUserIntoDB(
    currentUserId,
    postUserId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unfollow success!',
    data: result,
  });
});

// ADD FAVORITE
const addFavourite = catchAsync(async (req, res) => {
  const currentUserId = req.user._id;
  const postId = req.params.postId;

  const result = await UserServices.addFavouriteIntoDB(
    currentUserId,
    postId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add to Favourite successfully!',
    data: result,
  });
});

// REMOVE FAVORITE
const removeFavourite = catchAsync(async (req, res) => {
  const currentUserId = req.user._id;
  const postId = req.params.postId;

  const result = await UserServices.removeFavouriteIntoDB(
    currentUserId,
    postId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Removed from favourite successfully!',
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
  getAllAdmins,
  followUser,
  unfollowUser,
  addFavourite,
  removeFavourite,
  getMe,
};
