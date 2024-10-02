import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<ICategory>('Category', CategorySchema);
