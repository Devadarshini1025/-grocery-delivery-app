const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

// Local middleware: only delivery partners (defined here, not imported)
function deliveryOnly(req, res, next) {
  if (req.user && req.user.role === "delivery") {
    return next();
  }
  return res.status(403).json({ message: "Delivery partner access only" });
}

// Get orders assigned to the logged-in delivery partner
router.get("/my-orders", protect, deliveryOnly, async (req, res) => {
  try {
    const orders = await Order.find({
      assignedDeliveryPartner: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (out for delivery, delivered, etc.)
router.put("/orders/:id/status", protect, deliveryOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedDeliveryPartner: req.user._id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;