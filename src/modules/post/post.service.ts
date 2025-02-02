import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import QueryBuilder from '../../builder/QueryBuilder';
import { IPost } from './post.interface';
import { Post } from './post.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';

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
    Post.find().populate({ path: 'user' }),
    query,
  )
    .search(['title', 'description', 'category', 'content'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PostQuery.modelQuery.exec();
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
const makePremiumPostIntoDB = async (postId: string) => {
  const result = await Post.findByIdAndUpdate(
    postId,
    { isPremium: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found !');
  }

  return result;
};

// GET MY POSTS
const getMyPostsFromDB = async (query: Record<string, unknown>) => {
  const PostQuery = new QueryBuilder(Post.find(), query)
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

// UPVOTE
const upvoteIntoDB = async (postId: string, userId: string) => {
  if (!postId || !userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Post ID or User ID missing!',
    );
  }

  // Get the post and user
  const post = await Post.getPostById(postId);
  const user = await User.getUserById(userId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Check if the user has already upvoted the post
  if (post.upvotes.includes(user._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already upvoted this post!',
    );
  }

  // Begin a session to ensure consistency (if needed)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Add user to upvotes array and increment upvotes count
    await post.updateOne(
      {
        $push: { upvotes: user._id },
        $inc: { upvotesCount: 1 },
      },
      { session },
    );

    // If user had downvoted, remove the downvote and decrement downvotes count
    if (post.downvotes.includes(user._id)) {
      await post.updateOne(
        {
          $pull: { downvotes: user._id },
          $inc: { downvotesCount: -1 },
        },
        { session },
      );
    }

    // Commit the transaction if all updates succeed
    await session.commitTransaction();

    return { message: 'Upvote successful!' };
  } catch (error) {
    // Abort transaction in case of failure
    await session.abortTransaction();

    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Upvote failed!');
  } finally {
    session.endSession();
  }
};

// DOWNVOTE POST
const downvoteIntoDB = async (postId: string, userId: string) => {
  if (!postId || !userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Post ID or User ID missing!',
    );
  }

  // Get the post and user
  const post = await Post.getPostById(postId);
  const user = await User.getUserById(userId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Check if the user has already downvoted the post
  if (post.downvotes.includes(user._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already downvoted this post!',
    );
  }

  // Begin a session to ensure consistency (if needed)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // If user had upvoted, remove the upvote and decrement upvotes count
    if (post.upvotes.includes(user._id)) {
      await post.updateOne(
        {
          $pull: { upvotes: user._id },
          $inc: { upvotesCount: -1 },
        },
        { session },
      );
    }

    // Add user to downvotes array and increment downvotes count
    await post.updateOne(
      {
        $push: { downvotes: user._id },
        $inc: { downvotesCount: 1 },
      },
      { session },
    );

    // Commit the transaction if all updates succeed
    await session.commitTransaction();

    return { message: 'Downvote successful!' };
  } catch (error) {
    // Abort transaction in case of failure
    await session.abortTransaction();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Downvote failed!',
    );
  } finally {
    session.endSession();
  }
};

// GET USER STATS
const getPostStatsFromDB = async () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const previousYear = currentYear - 1;

  const data = await Post.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${previousYear}-01-01`),
          $lte: new Date(`${previousYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        numberOfPosts: { $sum: 1 },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { month: 1 },
    },
  ]);
  return data;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  makePremiumPostIntoDB,
  getMyPostsFromDB,
  downvoteIntoDB,
  upvoteIntoDB,
  getPostStatsFromDB,
};
