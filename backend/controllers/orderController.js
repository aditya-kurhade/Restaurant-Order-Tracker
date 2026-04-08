const pool = require('../db');

const isOrdersTableMissing = (error) => error && error.code === '42P01';

const createOrder = async (req, res) => {
  const { customer_name, item } = req.body;

  if (!customer_name || !item) {
    return res.status(400).json({ error: 'customer_name and item are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO orders (customer_name, item) VALUES ($1, $2) RETURNING *',
      [customer_name, item]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (isOrdersTableMissing(error)) {
      return res.status(500).json({ error: 'orders table not found. Run schema.sql in Neon SQL editor.' });
    }

    res.status(500).json({ error: 'Failed to create order' });
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    if (isOrdersTableMissing(error)) {
      return res.status(500).json({ error: 'orders table not found. Run schema.sql in Neon SQL editor.' });
    }

    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT status FROM orders WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentStatus = result.rows[0].status;
    let newStatus = currentStatus;

    if (currentStatus === 'Preparing') {
      newStatus = 'Ready';
    } else if (currentStatus === 'Ready') {
      newStatus = 'Completed';
    } else if (currentStatus === 'Completed') {
      return res.json(result.rows[0]);
    }

    const updatedOrder = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    res.json(updatedOrder.rows[0]);
  } catch (error) {
    if (isOrdersTableMissing(error)) {
      return res.status(500).json({ error: 'orders table not found. Run schema.sql in Neon SQL editor.' });
    }

    res.status(500).json({ error: 'Failed to update order' });
  }
};

const deleteCompletedOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];

    if (order.status !== 'Completed') {
      return res.status(400).json({ error: 'Only completed orders can be deleted' });
    }

    const deletedOrder = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    res.json(deletedOrder.rows[0]);
  } catch (error) {
    if (isOrdersTableMissing(error)) {
      return res.status(500).json({ error: 'orders table not found. Run schema.sql in Neon SQL editor.' });
    }

    res.status(500).json({ error: 'Failed to delete order' });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteCompletedOrder,
};