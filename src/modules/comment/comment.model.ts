import { Schema, model } from 'mongoose';
import { IComment } from './comment.interface';

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
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
  },
  {
    timestamps: true,
  },
);

export const Comment = model<IComment>('Comment', CommentSchema);
