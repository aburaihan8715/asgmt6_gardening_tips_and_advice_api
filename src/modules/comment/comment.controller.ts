import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { CommentServices } from './comment.service';

// CREATE
const createComment = catchAsync(async (req, res) => {
  const newComment = await CommentServices.createCommentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment created successfully',
    data: newComment,
  });
});

// GET ALL
const getAllComments = catchAsync(async (req, res) => {
  const result = await CommentServices.getAllCommentsFromDB(req.query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// GET ONE
const getComment = catchAsync(async (req, res) => {
  const Comment = await CommentServices.getCommentFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment retrieved successfully!',
    data: Comment,
  });
});

// UPDATE ONE
const updateComment = catchAsync(async (req, res) => {
  const updatedComment = await CommentServices.updateCommentIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully!',
    data: updatedComment,
  });
});

// DELETE ONE
const deleteComment = catchAsync(async (req, res) => {
  const deletedComment = await CommentServices.deleteCommentFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully!',
    data: deletedComment,
  });
});

export const CommentControllers = {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
