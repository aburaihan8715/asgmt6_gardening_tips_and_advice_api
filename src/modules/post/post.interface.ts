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
  upvotes: Types.ObjectId[];
  upvotesCount: number;
  downvotes: Types.ObjectId[];
  downvotesCount: number;
  comments: Types.ObjectId[];
  numberOfComments: number;
}

export interface PostModel extends Model<IPost> {
  getPostById(id: string): Promise<IPost>;
}
