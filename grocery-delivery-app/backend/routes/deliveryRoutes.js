const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

function deliveryOnly(req, res, next) {
  if (req.user.role !== "delivery") {
    return res.status(403).json({ message: "Delivery partner access only" });
  }
  next();
}

// Get assigned orders for logged-in driver
router.get("/my-orders", protect, deliveryOnly, async (req, res) => {
  const orders = await Order.find({ assignedDeliveryPartner: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Driver updates order status
router.put("/orders/:id/status", protect, deliveryOnly, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, assignedDeliveryPartner: req.user._id },
    { status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = router;