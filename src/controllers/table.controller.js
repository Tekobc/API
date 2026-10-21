import { createTable, getAllTables, getTableById, updateTableStatus, deleteTable } from '../models/Table.js';

// Get list of all tables
export const getTables = async (req, res) => {
  try {
    const tables = await getAllTables();
    res.success(tables, 'Tables retrieved');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error fetching tables');
  }
};

// Get a single table by its ID
export const getTable = async (req, res) => {
  try {
    const table = await getTableById(req.params.id);
    if (!table) return res.error(404, 'Table not found');
    res.success(table, 'Table retrieved');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error fetching table');
  }
};

// Create a new table (admin only)
export const createNewTable = async (req, res) => {
  try {
    const { number, capacity, location } = req.body;
    const result = await createTable({ number, capacity, location });
    const newTable = await getTableById(result.insertId);
    res.success(newTable, 'Table created');
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.error(409, 'Table number already exists');
    }
    res.error(500, 'Error creating table');
  }
};

// Update a table's status (e.g., free, occupied, reserved)
export const updateTable = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await updateTableStatus(req.params.id, status);
    if (result.affectedRows === 0) return res.error(404, 'Table not found');
    const updated = await getTableById(req.params.id);
    res.success(updated, 'Table status updated');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error updating table');
  }
};

// Delete a table
export const deleteTableById = async (req, res) => {
  try {
    const result = await deleteTable(req.params.id);
    if (result.affectedRows === 0) return res.error(404, 'Table not found');
    res.success(null, 'Table deleted');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error deleting table');
  }
};

export default {
  getTables,
  getTable,
  createNewTable,
  updateTable,
  deleteTableById,
};
