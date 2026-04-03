const Order = require('../models/Order');

// @desc    Create order
// @route   POST /api/order
// @access  User
const createOrder = async (req, res) => {
  try {
    const { customerName, address, phone, items, totalPrice, paymentMethod, notes } = req.body;

    if (!customerName || !address || !phone || !items || !totalPrice || !paymentMethod) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    if (!items.length) {
      return res.status(400).json({ message: 'Keranjang tidak boleh kosong' });
    }

    const order = await Order.create({
      userId: req.user._id,
      customerName,
      address,
      phone,
      items,
      totalPrice,
      paymentMethod,
      notes: notes || '',
    });

    res.status(201).json({ message: 'Pesanan berhasil dibuat', order });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat pesanan', error: err.message });
  }
};

// @desc    Get all orders (petugas/admin)
// @route   GET /api/order
// @access  Petugas/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil pesanan', error: err.message });
  }
};

// @desc    Get user orders
// @route   GET /api/order/user/me
// @access  User
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil pesanan', error: err.message });
  }
};

// @desc    Update order status
// @route   PUT /api/order/:id/status
// @access  Petugas/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ['pending', 'diproses', 'selesai', 'dibatalkan'];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    res.json({ message: 'Status pesanan diupdate', order });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate status', error: err.message });
  }
};

// @desc    Get order stats (admin)
// @route   GET /api/order/stats
// @access  Admin
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const diprosesOrders = await Order.countDocuments({ status: 'diproses' });
    const selesaiOrders = await Order.countDocuments({ status: 'selesai' });

    const revenueData = await Order.aggregate([
      { $match: { status: 'selesai' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({ totalOrders, pendingOrders, diprosesOrders, selesaiOrders, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil statistik', error: err.message });
  }
};

module.exports = { createOrder, getAllOrders, getUserOrders, updateOrderStatus, getOrderStats };
