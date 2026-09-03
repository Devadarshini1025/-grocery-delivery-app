const Product = require('../models/Product');

// @route GET /api/products
// Supports ?keyword=&category=&page=&limit=
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const filter = { isAvailable: true };
    if (req.query.keyword) {
      filter.name = { $regex: req.query.keyword, $options: 'i' };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/products (admin)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, unit, image, stock } = req.body;
    const product = await Product.create({ name, description, category, price, unit, image, stock });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/products/:id (admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json({ success: true, product: updated });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/products/:id (admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/products/:id/reviews (protected)
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product' });
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.recalculateRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};