import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { superheroRoutes } from './routes/superheroRoutes';
import { errorHandler } from './middleware/errorHandler';

const createApp = (): express.Application => {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  app.use(cors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Alternative dev port
      'https://superhero-frontend-25c9.onrender.com', // Your Render frontend
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.use('/api/superheroes', superheroRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  app.use(errorHandler);

  return app;
};

export { createApp };
