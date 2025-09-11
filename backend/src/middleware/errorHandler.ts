import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

const ERROR_MAPPINGS = {
  LIMIT_FILE_SIZE: { status: 400, message: 'File size must be less than 10MB' },
  LIMIT_FILE_COUNT: { status: 400, message: 'Too many files uploaded' },
  LIMIT_UNEXPECTED_FILE: { status: 400, message: 'Unexpected file field' },

  P2002: {
    status: 409,
    message: 'A superhero with this nickname already exists',
  },
  P2025: { status: 404, message: 'Record not found' },
  P2003: { status: 400, message: 'Invalid reference' },
} as const;

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    url: req.url,
    method: req.method,
  });

  if (err.code && ERROR_MAPPINGS[err.code as keyof typeof ERROR_MAPPINGS]) {
    const mapping = ERROR_MAPPINGS[err.code as keyof typeof ERROR_MAPPINGS];
    return res.status(mapping.status).json({
      success: false,
      error: mapping.message,
    });
  }

  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: 'Only JPEG, PNG, GIF, and WebP images are allowed',
    });
  }

  if (err.message.includes('File too large')) {
    return res.status(400).json({
      success: false,
      error: 'File too large',
      message: 'File size must be less than 10MB',
    });
  }

  if (err.message.includes('Unique constraint')) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      message: 'A superhero with this nickname already exists',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      code: err.code,
    }),
  });
};
