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

// GET TOP 5 POSTS
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

// GET ALL POSTS
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
  const postId = req.params.id;
  const premiumPost = await PostServices.makePremiumPostIntoDB(postId);

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

// UPVOTE
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

// DOWNVOTE
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

// ADD COMMENT
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

// GET COMMENTS
const getComments = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const query = { ...req.query, isDeleted: { $ne: true }, post: postId };
  const result = await PostServices.getCommentsForPost(query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully!',
    data: result,
  });
});

// GET POST STATS
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
  addComment,
  getComments,
  upvote,
  downvote,
  getPostStats,
};
