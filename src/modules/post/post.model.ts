import { model, Schema } from 'mongoose';
import { IPost, PostModel } from './post.interface';

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
  },
  {
    timestamps: true,
  },
);

PostSchema.statics.getPostById = async function (
  id: string,
): Promise<IPost | null> {
  return await this.findById(id);
};

export const Post = model<IPost, PostModel>('Post', PostSchema);
