import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { PostServices } from './post.service';

// CREATE
const createPost = catchAsync(async (req, res) => {
  const newPost = await PostServices.createPostIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post created successfully',
    data: newPost,
  });
});

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

export const PostControllers = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};
