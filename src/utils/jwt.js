import jwt from 'jsonwebtoken';

// Read the secret from the environment (defined in .env). If it is missing, fall back to a hard‑coded value for local dev only.
const JWT_SECRET = process.env.JWT_SECRET || 'teko2026'; // <-- tu secreto de desarrollo

/**
 * Generate a JWT token.
 * @param {Object} payload   - Datos que quieres firmar (por ejemplo { id, role }).
 * @param {string|number} [expiresIn='1h'] - Tiempo de expiración (valor aceptado por jsonwebtoken).
 * @returns {string} El token firmado.
 */
export const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token and return its decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Export aliases that some parts of the code expect
export const signToken = generateToken;
export const verify = verifyToken;
