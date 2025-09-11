import fs from 'fs/promises';
import path from 'path';
import { getPrismaClient } from '../config/database';

const prisma = getPrismaClient();

export const addImagesToSuperhero = async (
  superheroId: string,
  files: Express.Multer.File[]
): Promise<void> => {
  const imageData = files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: `/uploads/${file.filename}`,
    superheroId,
  }));

  await prisma.superheroImage.createMany({
    data: imageData,
  });
};

export const removeImageFromSuperhero = async (
  imageId: string,
  superheroId: string
): Promise<boolean> => {
  try {
    const image = await prisma.superheroImage.findFirst({
      where: {
        id: imageId,
        superheroId,
      },
    });

    if (!image) return false;

    const filePath = path.join(process.cwd(), 'uploads', image.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete file ${filePath}:`, error);
    }

    await prisma.superheroImage.delete({
      where: { id: imageId },
    });

    return true;
  } catch (error: any) {
    if (error.code === 'P2025') {
      return false;
    }
    throw error;
  }
};

export const getSuperheroImages = async (superheroId: string) => {
  return await prisma.superheroImage.findMany({
    where: { superheroId },
    select: {
      id: true,
      filename: true,
      originalName: true,
      path: true,
      size: true,
      mimetype: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};
