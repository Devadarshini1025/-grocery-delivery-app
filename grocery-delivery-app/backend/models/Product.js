const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'fruits',
        'vegetables',
        'dairy',
        'bakery',
        'meat',
        'beverages',
        'snacks',
        'rice_atta_dals',
        'masalas_spices',
        'oils_ghee',
        'frozen_food',
        'cleaning',
        'personal_care',
        'baby_care',
        'household',
        'other',
      ],
    },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, default: 'each' },
    image: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Recalculate average rating whenever reviews change
productSchema.methods.recalculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating = total / this.reviews.length;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);