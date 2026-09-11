const express = require("express");
const router = express.Router();
const SupportTicket = require("../models/SupportTicket");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Customer creates a ticket
router.post("/", protect, async (req, res) => {
  try {
    const { subject, message, orderId, photoUrl } = req.body;
    const ticket = await SupportTicket.create({
      user: req.user._id,
      order: orderId || undefined,
      subject,
      message,
      photoUrl,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin views all tickets
router.get("/", protect, adminOnly, async (req, res) => {
  const tickets = await SupportTicket.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(tickets);
});

// Admin updates/replies to ticket
router.put("/:id", protect, adminOnly, async (req, res) => {
  const { adminReply, status } = req.body;
  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    { adminReply, status },
    { new: true }
  );
  res.json(ticket);
});

module.exports = router;