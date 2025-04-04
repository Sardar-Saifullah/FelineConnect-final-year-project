import { Category } from "../models/index.js";
export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  try {
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  try {
    const [updated] = await Category.update({ name }, { where: { id } });
    if (updated) {
      const updatedCategory = await Category.findByPk(id);
      return res.status(200).json(updatedCategory);
    }
    return res.status(404).json({ message: "Category not found" });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Category.destroy({ where: { id } });
    if (deleted) {
      return res.status(204).json({ message: "Category has been deleted" });
    }
    return res.status(404).json({ message: "Category not found" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
