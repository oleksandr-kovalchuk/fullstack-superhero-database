import { FILE_CONFIG } from './constants';

export const validateFileType = (file: File): boolean => {
  return (FILE_CONFIG.ALLOWED_TYPES as readonly string[]).includes(file.type);
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= FILE_CONFIG.MAX_SIZE;
};

export const validateFiles = (
  files: File[]
): { valid: File[]; errors: string[] } => {
  const valid: File[] = [];
  const errors: string[] = [];

  files.forEach((file) => {
    if (!validateFileType(file)) {
      errors.push(
        `${file.name}: Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.`
      );
      return;
    }
    if (!validateFileSize(file)) {
      errors.push(`${file.name}: File size must be less than 10MB.`);
      return;
    }
    valid.push(file);
  });

  return { valid, errors };
};

export const getImageUrl = (filename: string): string => {
  return `${
    process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
    'http://localhost:3001'
  }/uploads/${filename}`;
};

export const createFormData = (
  data: Record<string, string>,
  files?: File[]
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('images', file);
    });
  }

  return formData;
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const calculatePagination = (
  page: number,
  limit: number,
  total: number
) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
