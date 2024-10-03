import { Document, Types } from 'mongoose';

// Define the TypeScript interface for a Post
export interface IPost extends Document {
  user: Types.ObjectId;
  content: string;
  category: 'Vegetables' | 'Flowers' | 'Landscaping' | 'Others';
  image: string;
  premium: boolean;
  isDeleted: boolean;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
}
