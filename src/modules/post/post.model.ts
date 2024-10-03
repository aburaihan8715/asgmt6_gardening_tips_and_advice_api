import { model, Schema } from 'mongoose';
import { IPost } from './post.interface';

// Define the Mongoose schema for a Post
const PostSchema: Schema<IPost> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    premium: {
      type: Boolean,
      default: false,
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

export const Post = model<IPost>('Post', PostSchema);
