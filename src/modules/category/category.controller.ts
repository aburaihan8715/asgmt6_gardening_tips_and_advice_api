import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';
import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';

// CREATE
const createCategory = catchAsync(async (req, res) => {
  const newCategory = await CategoryServices.createCategoryIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: newCategory,
  });
});

// GET ALL
const getAllCategories = catchAsync(async (req, res) => {
  const query = { ...req.query, isDeleted: { $ne: true } };
  const result = await CategoryServices.getAllCategoriesFromDB(query);

  if (!result || result?.result.length < 1)
    return sendNotFoundDataResponse(res);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// GET ONE
const getCategory = catchAsync(async (req, res) => {
  const category = await CategoryServices.getCategoryFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully!',
    data: category,
  });
});

// UPDATE ONE
const updateCategory = catchAsync(async (req, res) => {
  const updatedCategory = await CategoryServices.updateCategoryIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully!',
    data: updatedCategory,
  });
});

// DELETE ONE
const deleteCategory = catchAsync(async (req, res) => {
  const deletedCategory = await CategoryServices.deleteCategoryFromDB(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully!',
    data: deletedCategory,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
