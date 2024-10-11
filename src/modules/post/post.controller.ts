import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { PostServices } from './post.service';
import { NextFunction, Request, Response } from 'express';

// CREATE
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

// GET NEW 5 POSTS
const getAliasPosts = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.limit = '5';
  req.query.sort = '-createdAt';
  req.query.fields = '-content';
  next();
};

// GET ALL
const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostsFromDB(req.query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// GET ONE
const getPost = catchAsync(async (req, res) => {
  const Post = await PostServices.getPostFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post retrieved successfully!',
    data: Post,
  });
});

// UPDATE ONE
const updatePost = catchAsync(async (req, res) => {
  const updatedPost = await PostServices.updatePostIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully!',
    data: updatedPost,
  });
});

// DELETE ONE
const deletePost = catchAsync(async (req, res) => {
  const deletedPost = await PostServices.deletePostFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully!',
    data: deletedPost,
  });
});

// MAKE PREMIUM
const makePremiumPost = catchAsync(async (req, res) => {
  const premiumPost = await PostServices.makePremiumPostIntoDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post make premium successfully!',
    data: premiumPost,
  });
});

// GET ALL
const getMyPosts = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await PostServices.getMyPostsFromDB(userId, req.query);

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

export const PostControllers = {
  createPost,
  getAliasPosts,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  makePremiumPost,
  getMyPosts,
};
