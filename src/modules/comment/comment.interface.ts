import { Document, Types } from 'mongoose';

export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  isDeleted: boolean;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
}
