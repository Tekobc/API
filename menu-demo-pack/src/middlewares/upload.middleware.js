import multer from 'multer';
import path from 'node:path';
import { ApiError } from '../utils/apiError.js';

const storage = multer.diskStorage({
  destination: 'uploads/menu/',
  filename: (req, file, cb) =>
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`)
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) =>
    /^image\/(jpeg|png|webp)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new ApiError(400, 'INVALID_INPUT', 'Solo se aceptan imágenes JPG, PNG o WEBP'))
}).single('image');
