import multer from 'multer';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const uploadDirectory = join(process.cwd(), 'uploads', 'menu');
mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${req.params.id}-${Date.now()}${extension}`);
  }
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return callback(null, true);
    const error = new Error('Solo se aceptan imágenes JPG, PNG o WEBP');
    error.status = 400;
    callback(error);
  }
}).single('image');
