import { Types } from 'mongoose';

export interface IComment {
  post: Types.ObjectId | string;
  user: Types.ObjectId | string;
  content: string;
  isDeleted?: boolean;
}
