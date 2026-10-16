import bcrypt from 'bcrypt';
import { crearUsuario } from '../model/usuario.model.js';

const SALT_ROUNDS = 10;

export const registroApi = async (req, res) => {
  try {
    const { email, password, nombre, apellido } = req.body;

    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({
        mensaje: 'Todos los campos (email, password, nombre, apellido) son obligatorios.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const resultado = await crearUsuario(email, hashedPassword, nombre, apellido);

    return res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({
      mensaje: 'Error al registrar el usuario en la base de datos',
      error: error.message
    });
  }
};

export default {
  registroApi
};