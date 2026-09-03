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
      enum: ['fruits', 'vegetables', 'dairy', 'bakery', 'meat', 'beverages', 'snacks', 'household', 'other'],
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

// Helper function to extract search term from description
function getSearchTermFromDescription(description = '') {
  if (!description) return 'groceries';

  // Extract the first 3 meaningful words from the description
  const cleanWords = description
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter((word) => word.length > 2);

  const queryKeywords = cleanWords.slice(0, 3).join(',');
  return queryKeywords || 'groceries';
}

// Pre-save middleware: generates image URL from description if empty
productSchema.pre('save', function (next) {
  if (!this.image || this.image.trim() === '') {
    const searchTerm = getSearchTermFromDescription(this.description);
    // Dynamic image query based on product description keywords
    this.image = `https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80&auto=format&fit=crop&sig=${encodeURIComponent(searchTerm)}`;
  }
  next();
});

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