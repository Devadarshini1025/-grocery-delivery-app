const Order = require('../models/Order');

// @desc    Create new offline order (Cash on Delivery)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      items,
      shippingAddress,
      itemsPrice = 0,
      deliveryFee = 0,
      shippingPrice = 0,
      totalPrice = 0,
    } = req.body;

    const finalItems = items || orderItems;

    if (!finalItems || finalItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Please provide delivery address details' });
    }

    const order = new Order({
      user: req.user._id,
      items: finalItems,
      shippingAddress,
      paymentMethod: 'Cash on Delivery (COD)',
      itemsPrice,
      deliveryFee: deliveryFee || shippingPrice,
      totalPrice,
      isPaid: false, // Collected in cash upon delivery
      paidAt: null,
      status: 'pending',
    });

    const createdOrder = await order.save();
    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Payment will be collected upon delivery (COD).',
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email phone').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin) - Marking 'delivered' collects the offline cash payment
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const newStatus = req.body.status;
    if (newStatus) {
      order.status = newStatus;
    }

    // When order is delivered, COD cash is collected
    if (newStatus === 'delivered') {
      order.deliveredAt = Date.now();
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json({
      success: true,
      message: newStatus === 'delivered' ? 'Order delivered and cash payment recorded' : 'Order status updated',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};