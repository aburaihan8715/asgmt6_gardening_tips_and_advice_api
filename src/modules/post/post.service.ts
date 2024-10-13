import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import QueryBuilder from '../../builder/QueryBuilder';
import { IPost } from './post.interface';
import { Comment, Post } from './post.model';
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
    Post.find().populate({ path: 'user' }),
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
    await post.updateOne({
      $pull: { downvotes: user._id },
      $inc: { downvotesCount: -1 }, // Decrement downvotes count
    });
  }

  // Add to upvotes
  await post.updateOne({
    $push: { upvotes: user._id },
    $inc: { upvotesCount: 1 }, // Increment upvotes count
  });

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
    await post.updateOne({
      $pull: { upvotes: user._id },
      $inc: { upvotesCount: -1 }, // Decrement upvotes count
    });
  }

  // Add to downvotes
  await post.updateOne({
    $push: { downvotes: user._id },
    $inc: { downvotesCount: 1 }, // Increment downvotes count
  });

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

  await post.updateOne({
    $pull: { upvotes: user._id },
    $inc: { upvotesCount: -1 }, // Decrement upvotes count
  });

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

  await post.updateOne({
    $pull: { downvotes: user._id },
    $inc: { downvotesCount: -1 }, // Decrement downvotes count
  });

  return null;
};

// Add a comment to a post
const addCommentToPost = async (
  postId: string,
  userId: string,
  content: string,
) => {
  const newComment = await Comment.create({
    post: postId,
    user: userId,
    content,
  });

  await Post.findByIdAndUpdate(postId, {
    $push: { comments: newComment._id },
    $inc: { numberOfComments: 1 },
  });

  return newComment;
};

// Get comments for a post
const getCommentsForPost = async (postId: string) => {
  return await Comment.find({ post: postId })
    .populate('post')
    .populate('user');
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  makePremiumPostIntoDB,
  getMyPostsFromDB,
  upvotePostInDB,
  downvotePostInDB,
  removeUpvoteFromDB,
  removeDownvoteFromDB,
  addCommentToPost,
  getCommentsForPost,
};
