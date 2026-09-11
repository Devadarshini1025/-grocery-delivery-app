const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 1. Get list of available delivery partners for the dropdown
router.get("/delivery-partners", protect, adminOnly, async (req, res) => {
  try {
    const partners = await User.find({ role: "delivery" }).select("name email");
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Assign a delivery partner to a specific order
router.put("/orders/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedDeliveryPartner: deliveryPartnerId },
      { new: true }
    ).populate("assignedDeliveryPartner", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;