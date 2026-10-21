import { createReservation, getReservationById, getReservationsByUser, getAllReservations, cancelReservation } from '../models/Reservation.js';
import { pool } from '../db.js';

// Create a reservation (authenticated user)
export const createNewReservation = async (req, res) => {
  try {
    const userId = req.user.id; // auth middleware attaches user
    const { table_id, date, guests } = req.body;
    // Basic validation: date must be future
    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      return res.error(400, 'Fecha inválida');
    }
    if (reservationDate < new Date()) {
      return res.error(400, 'La fecha de la reserva debe ser futura');
    }
    // Check table availability (simple equality check)
    const [existing] = await pool.execute(
      'SELECT * FROM reservations WHERE table_id = ? AND date = ? AND status = ?',[
        table_id,
        reservationDate,
        'confirmed'
      ]
    );
    if (existing.length > 0) {
      return res.error(409, 'La mesa ya está reservada en esa fecha/hora');
    }
    const result = await createReservation({ user_id: userId, table_id, date: reservationDate, guests });
    const reservation = await getReservationById(result.insertId);
    res.success(reservation, 'Reserva creada');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error creando reserva', err.message);
  }
};

// Get reservations for the authenticated user
export const getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await getReservationsByUser(userId);
    res.success(reservations, 'Reservas del usuario');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error obteniendo reservas', err.message);
  }
};

// Admin: get all reservations
export const getAll = async (req, res) => {
  try {
    const reservations = await getAllReservations();
    res.success(reservations, 'Todas las reservas');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error obteniendo reservas', err.message);
  }
};

// Cancel a reservation (owner or admin)
export const cancel = async (req, res) => {
  try {
    const reservation = await getReservationById(req.params.id);
    if (!reservation) return res.error(404, 'Reserva no encontrada');
    // Only owner or admin can cancel
    if (req.user.id !== reservation.user_id && req.user.role !== 'admin') {
      return res.error(403, 'No autorizado para cancelar esta reserva');
    }
    const result = await cancelReservation(req.params.id);
    if (result.affectedRows === 0) return res.error(404, 'Reserva no encontrada');
    res.success(null, 'Reserva cancelada');
  } catch (err) {
    console.error(err);
    res.error(500, 'Error cancelando reserva', err.message);
  }
};

export default {
  createNewReservation,
  getMyReservations,
  getAll,
  cancel,
};
