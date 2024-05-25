import { Category } from "../Models/category.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
const createCategory = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new apiError(400, "Category name is required");
  }
  if (name.trim() === "") {
    throw new apiError(400, "Category name cannot be empty");
  }
  const categoryExists = await Category.find({ name });
  if (categoryExists.length > 1) {
    throw new apiError(400, "Category already exists");
  }
  const category = await Category.create({
    name,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category created successfully"));
});
const getCategory = AsyncHandler(async (req, res) => {
  const category = await Category.find();
  if (category.length === 0) {
    throw new apiError(404, "No category found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});
const deleteCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new apiError(404, "Category not found");
  }
  await Category.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});
const updateCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    throw new apiError(400, "Category name is required");
  }
  if (name.trim() === "") {
    throw new apiError(400, "Category name cannot be empty");
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new apiError(404, "Category not found");
  }
  const categoryExists = await Category.find({ name });
  if (categoryExists.length > 1) {
    throw new apiError(400, "Category already exists");
  }
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      name,
    },
    { new: true }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );
});
export { createCategory, getCategory, deleteCategory, updateCategory };
