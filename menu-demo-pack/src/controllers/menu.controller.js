import * as menu from '../services/menu.service.js';
import { validateMenuItem } from '../validations/menu.validation.js';
import { ApiError } from '../utils/apiError.js';

// Express 5 reenvía solo los errores de funciones async al error middleware.
export const list = async (req, res) =>
  res.json({ success: true, data: await menu.list(req.query) });

export const getOne = async (req, res) =>
  res.json({ success: true, data: await menu.getById(req.params.id) });

export const create = async (req, res) => {
  const data = validateMenuItem(req.body);
  res.status(201).json({ success: true, message: 'Plato creado exitosamente', data: await menu.create(data) });
};

export const update = async (req, res) => {
  const data = validateMenuItem(req.body, true);
  res.json({ success: true, message: 'Plato actualizado exitosamente', data: await menu.update(req.params.id, data) });
};

export const remove = async (req, res) => {
  await menu.remove(req.params.id);
  res.json({ success: true, message: 'Plato eliminado exitosamente' });
};

export const uploadImage = async (req, res) => {
  if (!req.file) throw new ApiError(400, 'INVALID_INPUT', 'Falta el archivo en el campo image');
  res.json({ success: true, message: 'Imagen subida exitosamente', data: await menu.setImage(req.params.id, req.file.filename) });
};
