import { Document, Types } from 'mongoose';

// Define the TypeScript interface for a Post
export interface IPost extends Document {
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
}
