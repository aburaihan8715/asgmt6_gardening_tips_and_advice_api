import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import QueryBuilder from '../../builder/QueryBuilder';

// CREATE
const createCategoryIntoDB = async (payload: ICategory) => {
  let newCategory = await Category.create(payload);

  if (!newCategory) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to cerate category. Try again!',
    );
  }
  newCategory = newCategory.toObject();
  delete newCategory.__v;

  return newCategory;
};

// GET ALL
const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    Category.find({ isDeleted: { $ne: true } }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  return {
    meta,
    result,
  };
};

// GET ONE
const getCategoryFromDB = async (id: string) => {
  const result = await Category.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found !');
  }

  if (result && result.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Category has been deleted!',
    );
  }
  return result;
};

// UPDATE ONE
const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<ICategory>,
) => {
  const result = await Category.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found !');
  }

  if (result && result.isDeleted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Category has been deleted!',
    );
  }
  return result;
};

// DELETE ONE
const deleteCategoryFromDB = async (id: string) => {
  const result = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found !');
  }

  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
