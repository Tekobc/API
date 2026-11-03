// Si ya tenés uno, conservá el tuyo: solo necesita respetar err.status y err.code.
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Error interno del servidor' : err.message,
    code: err.code || 'INTERNAL_ERROR'
  });
}
