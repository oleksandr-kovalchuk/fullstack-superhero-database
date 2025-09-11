export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  ENDPOINTS: {
    SUPERHEROES: '/superheroes',
    IMAGES: '/images',
  },
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  MAX_FILES: 10,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 5,
  MAX_LIMIT: 50,
} as const;

export const UI_CONFIG = {
  PRIORITY_IMAGES_COUNT: 6,
} as const;
