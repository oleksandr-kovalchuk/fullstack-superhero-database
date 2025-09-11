import { z } from 'zod';

export const createSuperheroSchema = z.object({
  nickname: z.string()
    .min(1, 'Nickname is required')
    .max(100, 'Nickname must be less than 100 characters'),
  realName: z.string()
    .min(1, 'Real name is required')
    .max(100, 'Real name must be less than 100 characters'),
  originDescription: z.string()
    .min(10, 'Origin description must be at least 10 characters')
    .max(2000, 'Origin description must be less than 2000 characters'),
  superpowers: z.string()
    .min(1, 'Superpowers are required')
    .max(1000, 'Superpowers must be less than 1000 characters'),
  catchPhrase: z.string()
    .min(1, 'Catch phrase is required')
    .max(200, 'Catch phrase must be less than 200 characters'),
});

export const updateSuperheroSchema = z.object({
  nickname: z.string()
    .min(1, 'Nickname cannot be empty')
    .max(100, 'Nickname must be less than 100 characters')
    .optional(),
  realName: z.string()
    .min(1, 'Real name cannot be empty')
    .max(100, 'Real name must be less than 100 characters')
    .optional(),
  originDescription: z.string()
    .min(10, 'Origin description must be at least 10 characters')
    .max(2000, 'Origin description must be less than 2000 characters')
    .optional(),
  superpowers: z.string()
    .min(1, 'Superpowers cannot be empty')
    .max(1000, 'Superpowers must be less than 1000 characters')
    .optional(),
  catchPhrase: z.string()
    .min(1, 'Catch phrase cannot be empty')
    .max(200, 'Catch phrase must be less than 200 characters')
    .optional(),
});

export const paginationSchema = z.object({
  page: z.string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 1)
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z.string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 5)
    .refine((val) => val > 0 && val <= 50, 'Limit must be between 1 and 50'),
});