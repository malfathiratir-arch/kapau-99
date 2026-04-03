const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getUserOrders, updateOrderStatus, getOrderStats } = require('../controllers/orderController');
const { protect, staffOnly, adminOnly } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, staffOnly, getAllOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.get('/user/me', protect, getUserOrders);
router.put('/:id/status', protect, staffOnly, updateOrderStatus);

module.exports = router;
