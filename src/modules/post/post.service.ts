import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import QueryBuilder from '../../builder/QueryBuilder';
import { IPost } from './post.interface';
import { Post } from './post.model';

// CREATE
const createPostIntoDB = async (payload: IPost) => {
  let newPost = await Post.create(payload);

  if (!newPost) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to cerate Post. Try again!',
    );
  }
  newPost = newPost.toObject();
  delete newPost.__v;

  return newPost;
};

// GET ALL
const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const PostQuery = new QueryBuilder(
    Post.find({ isDeleted: { $ne: true } }).populate({ path: 'user' }),
    query,
  )
    .search(['title', 'description', 'category', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PostQuery.modelQuery;
  const meta = await PostQuery.countTotal();

  return {
    meta,
    result,
  };
};

// GET ONE
const getPostFromDB = async (id: string) => {
  const result = await Post.findById(id).populate({ path: 'user' });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found !');
  }

  if (result && result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post has been deleted!');
  }
  return result;
};

// UPDATE ONE
const updatePostIntoDB = async (id: string, payload: Partial<IPost>) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found !');
  }

  if (result && result.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post has been deleted!');
  }
  return result;
};

// DELETE ONE
const deletePostFromDB = async (id: string) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found !');
  }

  return result;
};

// MAKE POST PREMIUM
const makePremiumPostIntoDB = async (id: string) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { idPremium: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found !');
  }

  return result;
};

// GET MY POSTS
const getMyPostsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const PostQuery = new QueryBuilder(
    Post.find({ isDeleted: { $ne: true }, user: userId }),
    query,
  )
    .search(['title', 'description', 'category', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PostQuery.modelQuery;
  const meta = await PostQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  makePremiumPostIntoDB,
  getMyPostsFromDB,
};
