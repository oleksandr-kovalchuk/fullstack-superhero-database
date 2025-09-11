import fs from 'fs/promises';
import path from 'path';
import { getPrismaClient } from '../config/database';

const prisma = getPrismaClient();

export const addImagesToSuperhero = async (
  superheroId: string,
  files: Express.Multer.File[]
): Promise<void> => {
  const imageData = files.map(file => ({
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

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', image.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete file ${filePath}:`, error);
    }

    // Delete record from database
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

// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errorMessages,
        });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Query validation failed',
          details: errorMessages,
        });
      }
      next(error);
    }
  };
};