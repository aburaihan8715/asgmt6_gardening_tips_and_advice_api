import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { UserServices } from './user.service';
import AppError from '../../errors/AppError';

const createUser = catchAsync(async (req, res) => {
  const user = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: user,
  });
});

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

const getSingleUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const user = await UserServices.getSingleUserFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const deletedUser = await UserServices.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully!',
    data: deletedUser,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const id = req.user._id;
  const user = await UserServices.updateUserIntoDB(id, {
    ...JSON.parse(req.body.data),
    profilePicture: req.file?.path,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Settings updated successfully',
    data: user,
  });
});

const updateMe = catchAsync(async (req, res) => {
  const id = req.user._id;
  const user = await UserServices.updateMeIntoDB(id, {
    ...JSON.parse(req.body.data),
    profilePicture: req.file?.path,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Settings updated successfully',
    data: user,
  });
});

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

const deleteMe = catchAsync(async (req, res) => {
  const id = req.user._id;
  const user = await UserServices.deleteMeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: user,
  });
});

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

const checkHasUpvoteForPost = catchAsync(async (req, res) => {
  const userId = req?.user?._id;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await UserServices.checkHasUpvoteForPostIntoDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Premium status returned successfully!',
    data: result,
  });
});

const getFavouritePosts = catchAsync(async (req, res) => {
  // Step 1: Retrieve the authenticated user's ID
  const userId = req?.user?._id;

  // Step 2: Check if the user is authenticated
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  // Step 3: Call the service function to fetch favourite posts
  const favouritePosts =
    await UserServices.getFavouritePostsFromDB(userId);

  // Step 4: Send the response with the fetched posts
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favourite posts fetched successfully!',
    data: favouritePosts,
  });
});

const getUserStats = catchAsync(async (req, res) => {
  const userStats = await UserServices.getUserStatsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User stats fetched successfully!',
    data: userStats,
  });
});

const getRevenue = catchAsync(async (req, res) => {
  const revenue = await UserServices.getRevenueFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue fetched successfully!',
    data: revenue,
  });
});

export const UserControllers = {
  getAllUsers,
  updateUser,
  followUser,
  unfollowUser,
  addFavourite,
  removeFavourite,
  getMe,
  checkHasUpvoteForPost,
  getFavouritePosts,
  getUserStats,
  getRevenue,
  deleteUser,
  getSingleUser,
  deleteMe,
  createUser,
  updateMe,
};
