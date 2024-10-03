import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { IComment } from './comment.interface';
import { Comment } from './comment.model';

// CREATE
const createCommentIntoDB = async (payload: IComment) => {
  let newComment = await Comment.create(payload);

  if (!newComment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to cerate Comment. Try again!',
    );
  }
  newComment = newComment.toObject();
  delete newComment.__v;

  return newComment;
};

// GET ALL
const getAllCommentsFromDB = async (query: Record<string, unknown>) => {
  const CommentQuery = new QueryBuilder(
    Comment.find({ isDeleted: { $ne: true } }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CommentQuery.modelQuery;
  const meta = await CommentQuery.countTotal();

  return {
    meta,
    result,
  };
};

// GET ONE
const getCommentFromDB = async (id: string) => {
  const result = await Comment.findById(id);

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
  id: string,
  payload: Partial<IComment>,
) => {
  const result = await Comment.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true },
  );

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

// DELETE ONE
const deleteCommentFromDB = async (id: string) => {
  const result = await Comment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found !');
  }

  return result;
};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentsFromDB,
  getCommentFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
};
