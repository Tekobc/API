import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from '../models/Category.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.success(categories, 'Categorías obtenidas');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error al obtener categorías');
  }
};

// Get single category by ID
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) return res.error(404, 'Categoría no encontrada');
    res.success(category, 'Categoría encontrada');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error al obtener categoría');
  }
};

// Create new category
export const createNewCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await createCategory({ name, description });
    const newCategory = await getCategoryById(result.insertId);
    res.success(newCategory, 'Categoría creada');
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.error(409, 'Nombre de categoría ya existe');
    }
    res.error(500, 'Error al crear categoría');
  }
};

// Update existing category
export const updateExistingCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await updateCategory(id, { name, description });
    if (result.affectedRows === 0) return res.error(404, 'Categoría no encontrada');
    const updated = await getCategoryById(id);
    res.success(updated, 'Categoría actualizada');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error al actualizar categoría');
  }
};

// Delete category
export const deleteExistingCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCategory(id);
    if (result.affectedRows === 0) return res.error(404, 'Categoría no encontrada');
    res.success(null, 'Categoría eliminada');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error al eliminar categoría');
  }
};

export default {
  getCategories,
  getCategory,
  createNewCategory,
  updateExistingCategory,
  deleteExistingCategory,
};
