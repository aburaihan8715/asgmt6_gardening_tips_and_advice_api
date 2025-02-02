import { model, Schema } from 'mongoose';
import { IComment } from './comment.interface';

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
    comment: {
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

// Query middleware
// CommentSchema.pre(/^find/, function (next) {
//   const query = this as Query<any, any>;
//   query.populate({
//     path: 'post',
//     select: 'title',
//   });

//   next();
// });
export const Comment = model<IComment>('Comment', CommentSchema);
