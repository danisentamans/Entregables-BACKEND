const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder, deleteOrder, getOrdersById } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrdersById);
router.put('/:id', auth, updateOrder);
router.delete('/:id', auth, deleteOrder);

module.exports = router;
