import { Document, Model, Types } from 'mongoose';

// Define the TypeScript interface for a Post
export interface IPost extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  description: string;
  content: string;
  category: 'Vegetables' | 'Flowers' | 'Landscaping' | 'Others';
  image: string;
  isPremium: boolean;
  isDeleted: boolean;
  numberOfComments: number;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  comments: Types.ObjectId[];
}

export interface IComment {
  post: Types.ObjectId | string; // Change to postId
  user: Types.ObjectId | string; // Change to userId
  content: string;
  isDeleted?: boolean;
}

export interface PostModel extends Model<IPost> {
  getPostById(id: string): Promise<IPost>;
}
