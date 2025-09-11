import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { superheroRoutes } from './routes/superheroRoutes';
import { errorHandler } from './middleware/errorHandler';

const createApp = (): express.Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['http://localhost:3000'] // Add your frontend domains here
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static files for uploaded images
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes
  app.use('/api/superheroes', superheroRoutes);

  // 404 handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};

export { createApp };