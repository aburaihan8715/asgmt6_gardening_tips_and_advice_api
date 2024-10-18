import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

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
  const userId = req.user._id;
  const commentId = req.params.id;
  const payload = req.body;
  const updatedComment = await CommentServices.updateCommentIntoDB(
    userId,
    commentId,
    payload,
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
  const userId = req.user._id;
  const commentId = req.params.id;

  const deletedComment = await CommentServices.deleteCommentFromDB(
    userId,
    commentId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully!',
    data: deletedComment,
  });
});

export const CommentControllers = {
  getComment,
  updateComment,
  deleteComment,
};
