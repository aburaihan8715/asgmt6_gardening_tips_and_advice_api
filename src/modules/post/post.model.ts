import { model, Schema } from 'mongoose';
import { IComment, IPost, PostModel } from './post.interface';

// 01 COMMENT MODEL SCHEMA
const CommentSchema: Schema<IComment> = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Comment = model<IComment>('Comment', CommentSchema);

// 02 POST MODEL SCHEMA
const PostSchema: Schema<IPost> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Vegetables', 'Flowers', 'Landscaping', 'Others'],
    },
    image: {
      type: String,
      default: '',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    numberOfComments: {
      type: Number,
      default: 0,
    },
    upvotes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    downvotes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Post = model<IPost, PostModel>('Post', PostSchema);
