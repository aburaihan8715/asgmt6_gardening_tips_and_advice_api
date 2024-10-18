import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Post } from '../post/post.model';
import { Comment } from './comment.model';
import { IComment } from './comment.interface';

// GET ONE
const getCommentFromDB = async (id: string) => {
  const result = await Comment.findById(id)
    .populate({ path: 'user' })
    .populate({ path: 'post' });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found !');
  }

  if (result && result.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Comment has been deleted!',
    );
  }
  return result;
};

// UPDATE ONE
const updateCommentIntoDB = async (
  userId: string,
  commentId: string,
  payload: Partial<IComment>,
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
  }

  // Check if the comment belongs to the user
  if (comment.user.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot update this comment!',
    );
  }

  // If the comment is deleted, it cannot be updated
  if (comment.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Comment has been deleted!',
    );
  }

  // Update the comment
  Object.assign(comment, payload);
  await comment.save();

  return comment;
};

// DELETE ONE
const deleteCommentFromDB = async (userId: string, commentId: string) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
  }

  if (comment.user.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot delete this comment!',
    );
  }

  comment.isDeleted = true;
  await comment.save();

  const post = await Post.findOneAndUpdate(
    { comments: commentId },
    { $pull: { comments: commentId }, $inc: { numberOfComments: -1 } },
    { new: true },
  );

  if (!post) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Associated post not found for this comment!',
    );
  }

  return comment;
};

export const CommentServices = {
  getCommentFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
};
