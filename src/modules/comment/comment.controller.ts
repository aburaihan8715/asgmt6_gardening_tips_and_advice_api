import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user._id;

  const comment = await CommentServices.createCommentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment created successfully!',
    data: comment,
  });
});

const getAllComments = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.postId) filter = { post: req.params.postId };
  const comments = await CommentServices.getAllCommentsFromDB(filter);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment retrieved successfully!',
    data: comments,
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const comment = await CommentServices.getSingleCommentFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment retrieved successfully!',
    data: comment,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const updatedComment = await CommentServices.updateCommentIntoDB(
    req.user._id,
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

const deleteComment = catchAsync(async (req, res) => {
  const deletedComment = await CommentServices.deleteCommentFromDB(
    req.user._id,
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
  getSingleComment,
  updateComment,
  deleteComment,
  createComment,
  getAllComments,
};
