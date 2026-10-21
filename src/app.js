import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const currentDirectory = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(join(currentDirectory, 'public')));

// Global response helper middleware
app.use((req, res, next) => {
  res.success = (data, message = 'OK') => {
    res.json({ success: true, message, data });
  };
  res.error = (status, message, error = null) => {
    res.status(status).json({ success: false, message, error });
  };
  next();
});

app.use('/api', routes);
// Global error handling middleware
import errorHandler from './middlewares/error.middleware.js';
app.use(errorHandler);

export default app;
