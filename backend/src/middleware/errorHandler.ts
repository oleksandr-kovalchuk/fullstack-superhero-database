import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Multer file upload errors
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: err.message,
    });
  }

  if (err.message.includes('File too large')) {
    return res.status(400).json({
      success: false,
      error: 'File too large',
      message: 'File size must be less than 5MB',
    });
  }

  // Prisma errors
  if (err.message.includes('Unique constraint')) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      message: 'A superhero with this nickname already exists',
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};