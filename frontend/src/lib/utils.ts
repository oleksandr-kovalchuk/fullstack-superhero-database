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
  const baseUrl =
    import.meta.env.VITE_API_URL?.replace('/api', '') ||
    'http://localhost:3001';
  return `${baseUrl}/uploads/${filename}`;
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

export const validateFormField = (value: string, fieldName: string): string => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateSuperheroForm = (formData: {
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nicknameError = validateFormField(formData.nickname, 'Nickname');
  if (nicknameError) errors.nickname = nicknameError;

  const realNameError = validateFormField(formData.realName, 'Real name');
  if (realNameError) errors.realName = realNameError;

  const originError = validateFormField(
    formData.originDescription,
    'Origin description'
  );
  if (originError) errors.originDescription = originError;

  const superpowersError = validateFormField(
    formData.superpowers,
    'Superpowers'
  );
  if (superpowersError) errors.superpowers = superpowersError;

  const catchPhraseError = validateFormField(
    formData.catchPhrase,
    'Catch phrase'
  );
  if (catchPhraseError) errors.catchPhrase = catchPhraseError;

  return errors;
};

export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

export const revokeAllPreviewUrls = (urls: string[]): void => {
  urls.forEach(revokePreviewUrl);
};

export const removeItemAtIndex = <T>(array: T[], index: number): T[] => {
  return array.filter((_, i) => i !== index);
};

export const addItemsToArray = <T>(array: T[], items: T[]): T[] => {
  return [...array, ...items];
};
