const express = require('express');
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteCompletedOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);
router.delete('/:id', deleteCompletedOrder);

module.exports = router;