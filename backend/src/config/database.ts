import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = createPrismaClient();
  }
  return prisma;
};

const disconnectDatabase = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null as any; // Reset for potential reconnection
  }
};

export { getPrismaClient, disconnectDatabase };
