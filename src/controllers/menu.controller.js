import { getAllMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem } from '../models/MenuItem.js';

export const getMenu = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    const items = await getAllMenuItems(filters);
    res.success(items, 'Menu items retrieved');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error retrieving menu items');
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const item = await getMenuItemById(req.params.id);
    if (!item) return res.error(404, 'Menu item not found');
    res.success(item, 'Menu item retrieved');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error retrieving menu item');
  }
};

export const createNewMenuItem = async (req, res) => {
  try {
    const result = await createMenuItem(req.body);
    const newItem = await getMenuItemById(result.insertId);
    res.success(newItem, 'Menu item created');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error creating menu item');
  }
};

export const updateExistingMenuItem = async (req, res) => {
  try {
    const result = await updateMenuItem(req.params.id, req.body);
    if (result.affectedRows === 0) return res.error(404, 'Menu item not found');
    const updated = await getMenuItemById(req.params.id);
    res.success(updated, 'Menu item updated');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error updating menu item');
  }
};

export const deleteMenuItemById = async (req, res) => {
  try {
    const result = await deleteMenuItem(req.params.id);
    if (result.affectedRows === 0) return res.error(404, 'Menu item not found');
    res.success(null, 'Menu item deleted');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error deleting menu item');
  }
};

export default {
  getMenu,
  getMenuItem,
  createNewMenuItem,
  updateExistingMenuItem,
  deleteMenuItemById,
};
