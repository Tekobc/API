import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setMenuItemImage
} from '../models/MenuItem.js';

export const getMenu = async (req, res) => {
  const data = await getAllMenuItems(req.query);
  res.success(data, 'Menu items retrieved');
};

export const getMenuItem = async (req, res) => {
  const item = await getMenuItemById(req.params.id);
  if (!item) return res.error(404, 'Menu item not found');
  res.success(item, 'Menu item retrieved');
};

export const createNewMenuItem = async (req, res) => {
  const result = await createMenuItem({
    ...req.body,
    categoryId: req.body.categoryId ?? req.body.category_id
  });
  const newItem = await getMenuItemById(result.insertId);
  res.status(201).success(newItem, 'Plato creado exitosamente');
};

export const updateExistingMenuItem = async (req, res) => {
  const result = await updateMenuItem(req.params.id, {
    ...req.body,
    categoryId: req.body.categoryId ?? req.body.category_id
  });
  if (result.affectedRows === 0) return res.error(404, 'Menu item not found');
  const updated = await getMenuItemById(req.params.id);
  res.success(updated, 'Plato actualizado exitosamente');
};

export const deleteMenuItemById = async (req, res) => {
  const result = await deleteMenuItem(req.params.id);
  if (result.affectedRows === 0) return res.error(404, 'Menu item not found');
  res.success(null, 'Plato eliminado exitosamente');
};

export const uploadMenuImage = async (req, res) => {
  if (!req.file) return res.error(400, 'Falta el archivo en el campo image');
  const item = await getMenuItemById(req.params.id);
  if (!item) return res.error(404, 'Menu item not found');
  const imageUrl = `/uploads/menu/${req.file.filename}`;
  res.success(await setMenuItemImage(req.params.id, imageUrl), 'Imagen subida exitosamente');
};
