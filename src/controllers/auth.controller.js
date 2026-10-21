import bcrypt from 'bcrypt';
import { createUser, getUserByEmail, getUserById } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido } = req.body;
    const hashed = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const result = await createUser({ email, password: hashed, nombre, apellido });
    const user = await getUserByEmail(email);
    const token = generateToken({ id: user.id, role: user.role || 'client' });
    res.success({ id: result.insertId, token }, 'Usuario registrado exitosamente');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error al registrar usuario', err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.error(401, 'Credenciales incorrectas');
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.error(401, 'Credenciales incorrectas');
    const token = generateToken({ id: user.id, role: user.role });
    res.success({ token }, 'Login exitoso');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error en login', err.message);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.error(404, 'Usuario no encontrado');
    const { password, ...safeData } = user; // omit password
    res.success(safeData, 'Perfil del usuario');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error obteniendo perfil', err.message);
  }
};
