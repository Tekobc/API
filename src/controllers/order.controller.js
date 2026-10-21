import { createOrder, getOrderById, updateOrderStatus, assignTableToOrder } from '../models/Order.js';

// Create a new order (with items, optional table assignment)
export const createNewOrder = async (req, res) => {
  try {
    const userId = req.user.id; // protected route, user info attached by auth middleware
    const { table_id, items } = req.body;
    const result = await createOrder({ user_id: userId, table_id, items });
    res.success({ orderId: result.orderId, total: result.total }, 'Order created successfully');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error creating order', err.message);
  }
};

// Retrieve order by its ID (including items)
export const getOrder = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.error(404, 'Order not found');
    res.success(order, 'Order retrieved');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error retrieving order', err.message);
  }
};

// Update order status (e.g., pending → preparing → ready → completed)
export const patchOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await updateOrderStatus(req.params.id, status);
    if (result.affectedRows === 0) return res.error(404, 'Order not found');
    res.success(null, 'Order status updated');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error updating order status', err.message);
  }
};

// Assign a table to an existing order (and mark table occupied)
export const assignTable = async (req, res) => {
  try {
    const { table_id } = req.body;
    const result = await assignTableToOrder(req.params.id, table_id);
    if (result.affectedRows === 0) return res.error(404, 'Order not found');
    res.success(null, 'Table assigned to order');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error assigning table to order', err.message);
  }
};

export default {
  createNewOrder,
  getOrder,
  patchOrderStatus,
  assignTable,
};