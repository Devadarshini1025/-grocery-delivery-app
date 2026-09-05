const Category = require('../models/Category');

// @route GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/categories (admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image } = req.body;
    const category = await Category.create({ name, slug, description, image });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/categories/:id (admin)
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    Object.assign(category, req.body);
    const updated = await category.save();
    res.json({ success: true, category: updated });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/categories/:id (admin)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ success: true, message: 'Category removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};