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

// ADD FAVORITE
const addFavourite = catchAsync(async (req, res) => {
  const currentUserId = req.user._id;
  const postId = req.params.id;

  const result = await PostServices.addFavouriteIntoDB(
    currentUserId,
    postId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorite added successfully!',
    data: result,
  });
});

// REMOVE FAVORITE
const removeFavourite = catchAsync(async (req, res) => {
  const currentUserId = req.user._id;
  const postId = req.params.id;

  const result = await PostServices.removeFavouriteIntoDB(
    currentUserId,
    postId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favorite removed successfully!',
    data: result,
  });
});

// UPVOTE POST
const upvotePost = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  await PostServices.upvotePostInDB(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post upvoted successfully!',
    data: null,
  });
});

// DOWNVOTE POST
const downvotePost = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  await PostServices.downvotePostInDB(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post downvoted successfully!',
    data: null,
  });
});

// REMOVE UPVOTE
const removeUpvote = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  await PostServices.removeUpvoteFromDB(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Upvote removed successfully!',
    data: null,
  });
});

// REMOVE DOWNVOTE
const removeDownvote = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  await PostServices.removeDownvoteFromDB(postId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Downvote removed successfully!',
    data: null,
  });
});

// Add a comment
const addComment = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;

  const comment = await PostServices.addCommentToPost(
    postId,
    userId,
    content,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment added successfully!',
    data: comment,
  });
});

// Get comments for a post
const getComments = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const comments = await PostServices.getCommentsForPost(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully!',
    data: comments,
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
  addFavourite,
  removeFavourite,
  upvotePost,
  downvotePost,
  removeUpvote,
  removeDownvote,
  addComment,
  getComments,
};
