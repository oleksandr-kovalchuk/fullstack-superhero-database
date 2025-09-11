import dotenv from 'dotenv';
import { createApp } from './app';
import { getPrismaClient, disconnectDatabase } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = async (): Promise<void> => {
  try {
    const prisma = getPrismaClient();
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🦸 API endpoints: http://localhost:${PORT}/api/superheroes`);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed.');

        try {
          await disconnectDatabase();
          console.log('Database disconnected.');
          process.exit(0);
        } catch (error) {
          console.error('Error during database disconnection:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
