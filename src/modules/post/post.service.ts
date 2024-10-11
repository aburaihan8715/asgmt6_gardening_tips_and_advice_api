import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import QueryBuilder from '../../builder/QueryBuilder';
import { IPost } from './post.interface';
import { Post } from './post.model';
import { User } from '../user/user.model';

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

// ADD FAVORITE
const addFavouriteIntoDB = async (
  currentUserId: string,
  postId: string,
) => {
  if (!currentUserId || !postId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  const currentUser = await User.getUserById(currentUserId);
  const post = await Post.getPostById(postId);

  if (!currentUser || !post) {
    throw new AppError(httpStatus.NOT_FOUND, 'User OR Post not found!');
  }

  if (currentUser.favourites.includes(post._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This post is already in your favorites!',
    );
  }

  // Add favorite logic
  await currentUser.updateOne({ $push: { favourites: post._id } });

  return null;
};

// REMOVE FAVORITE
const removeFavouriteIntoDB = async (
  currentUserId: string,
  postId: string,
) => {
  if (!currentUserId || !postId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  const currentUser = await User.getUserById(currentUserId);
  const post = await Post.getPostById(postId);

  if (!currentUser || !post) {
    throw new AppError(httpStatus.NOT_FOUND, 'User OR Post not found!');
  }

  if (!currentUser.favourites.includes(post._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This post is not your favorites!',
    );
  }

  // Remove favorite logic
  await currentUser.updateOne({ $pull: { favourites: post._id } });

  return null;
};

// UPVOTE POST
const upvotePostInDB = async (postId: string, userId: string) => {
  if (!postId || !userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  const post = await Post.getPostById(postId);
  const user = await User.getUserById(userId);

  if (!post || !user)
    throw new AppError(httpStatus.NOT_FOUND, 'Post OR User not found!');

  // Check if user has already upvoted the post
  if (post.upvotes.includes(user._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already upvoted this post!',
    );
  }

  // Remove from downvotes if the user has downvoted
  if (post.downvotes.includes(user._id)) {
    await post.updateOne({ $pull: { downvotes: user._id } });
  }

  // Add to upvotes
  await post.updateOne({ $push: { upvotes: user._id } });

  return null;
};

// DOWNVOTE POST
const downvotePostInDB = async (postId: string, userId: string) => {
  if (!postId || !userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  const post = await Post.getPostById(postId);
  const user = await User.getUserById(userId);

  if (!post || !user)
    throw new AppError(httpStatus.NOT_FOUND, 'Post OR User not found!');

  // Check if user has already downvoted the post
  if (post.downvotes.includes(user._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already downvoted this post!',
    );
  }

  // Remove from upvotes if the user has upvoted
  if (post.upvotes.includes(user._id)) {
    await post.updateOne({ $pull: { upvotes: user._id } });
  }

  // Add to downvotes
  await post.updateOne({ $push: { downvotes: user._id } });

  return null;
};

// REMOVE UPVOTE
const removeUpvoteFromDB = async (postId: string, userId: string) => {
  if (!postId || !userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  const post = await Post.getPostById(postId);
  const user = await User.getUserById(userId);

  if (!post || !user)
    throw new AppError(httpStatus.NOT_FOUND, 'Post OR User not found!');

  if (!post.upvotes.includes(user._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have not upvoted this post!',
    );
  }

  await post.updateOne({ $pull: { upvotes: user._id } });

  return null;
};

// REMOVE DOWNVOTE
const removeDownvoteFromDB = async (postId: string, userId: string) => {
  if (!postId || !userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Id not found!');
  }

  const post = await Post.getPostById(postId);
  const user = await User.getUserById(userId);

  if (!post || !user)
    throw new AppError(httpStatus.NOT_FOUND, 'Post OR User not found!');

  if (!post.downvotes.includes(user._id)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have not downvoted this post!',
    );
  }

  await post.updateOne({ $pull: { downvotes: user._id } });

  return null;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  makePremiumPostIntoDB,
  getMyPostsFromDB,
  addFavouriteIntoDB,
  removeFavouriteIntoDB,
  upvotePostInDB,
  downvotePostInDB,
  removeUpvoteFromDB,
  removeDownvoteFromDB,
};
