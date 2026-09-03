const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    // Purely offline payment (Cash on Delivery)
    paymentMethod: { type: String, default: 'Cash on Delivery (COD)' },
    itemsPrice: { type: Number, required: true, default: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: false }, // Paid when order is delivered
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);