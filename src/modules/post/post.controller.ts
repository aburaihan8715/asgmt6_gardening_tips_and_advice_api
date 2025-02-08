import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { PostServices } from './post.service';
import { NextFunction, Request, Response } from 'express';

const createPost = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const newPost = await PostServices.createPostIntoDB({
    ...req.body,
    user: userId,
    image: req.file?.path,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post created successfully',
    data: newPost,
  });
});

const getAliasPosts = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.limit = '5';
  req.query.sort = '-upvotesCount';
  req.query.fields = '-content';
  next();
};

const getAllPosts = catchAsync(async (req, res) => {
  const query = { ...req.query, isDeleted: { $ne: true } };

  const result = await PostServices.getAllPostsFromDB(query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts retrieved successfully!',
    meta: {
      ...result.meta,
      // NOTE: this is need for tan stack query
      hasNextPage: result.meta.page < result.meta.totalPage,
    },
    data: result.result,
  });
});

const getPost = catchAsync(async (req, res) => {
  const Post = await PostServices.getPostFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post retrieved successfully!',
    data: Post,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const updatedPost = await PostServices.updatePostIntoDB(req.params.id, {
    ...req.body,
    image: req.file?.path,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully!',
    data: updatedPost,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const deletedPost = await PostServices.deletePostFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully!',
    data: deletedPost,
  });
});

const makePremiumPost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const premiumPost = await PostServices.makePremiumPostIntoDB(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post make premium successfully!',
    data: premiumPost,
  });
});

const getMyPosts = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const query = { ...req.query, isDeleted: { $ne: true }, user: userId };
  const result = await PostServices.getMyPostsFromDB(query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My posts retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

const upvote = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  await PostServices.upvoteIntoDB(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post upvoted successfully!',
    data: null,
  });
});

const downvote = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  await PostServices.downvoteIntoDB(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post downvoted successfully!',
    data: null,
  });
});

const getPostStats = catchAsync(async (req, res) => {
  const result = await PostServices.getPostStatsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts stats fetched successfully!',
    data: result,
  });
});

export const PostControllers = {
  createPost,
  getAliasPosts,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  makePremiumPost,
  getMyPosts,
  upvote,
  downvote,
  getPostStats,
};
