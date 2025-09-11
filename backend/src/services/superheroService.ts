import { getPrismaClient } from '../config/database';
import {
  CreateSuperheroRequest,
  UpdateSuperheroRequest,
  SuperheroListItem,
  SuperheroDetails,
  PaginatedResponse,
} from '../types';

const prisma = getPrismaClient();

const IMAGE_SELECT_FIELDS = {
  id: true,
  filename: true,
  originalName: true,
  path: true,
  size: true,
  mimetype: true,
} as const;

const transformSuperheroToDetails = (superhero: any): SuperheroDetails => ({
  id: superhero.id,
  nickname: superhero.nickname,
  realName: superhero.realName,
  originDescription: superhero.originDescription,
  superpowers: superhero.superpowers,
  catchPhrase: superhero.catchPhrase,
  images: superhero.images,
  createdAt: superhero.createdAt.toISOString(),
  updatedAt: superhero.updatedAt.toISOString(),
});

export const createSuperhero = async (
  data: CreateSuperheroRequest
): Promise<SuperheroDetails> => {
  const superhero = await prisma.superhero.create({
    data: {
      nickname: data.nickname,
      realName: data.realName,
      originDescription: data.originDescription,
      superpowers: data.superpowers,
      catchPhrase: data.catchPhrase,
    },
    include: {
      images: {
        select: IMAGE_SELECT_FIELDS,
      },
    },
  });

  return transformSuperheroToDetails(superhero);
};

export const getSuperheroById = async (
  id: string
): Promise<SuperheroDetails | null> => {
  const superhero = await prisma.superhero.findUnique({
    where: { id },
    include: {
      images: {
        select: IMAGE_SELECT_FIELDS,
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!superhero) return null;

  return transformSuperheroToDetails(superhero);
};

export const getAllSuperheroes = async (
  page: number = 1,
  limit: number = 5
): Promise<PaginatedResponse<SuperheroListItem>> => {
  const skip = (page - 1) * limit;

  const [superheroes, total] = await Promise.all([
    prisma.superhero.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        nickname: true,
        images: {
          select: {
            id: true,
            filename: true,
            path: true,
          },
          take: 1,
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.superhero.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: superheroes.map((superhero) => ({
      id: superhero.id,
      nickname: superhero.nickname,
      image: superhero.images[0] || undefined,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const updateSuperhero = async (
  id: string,
  data: UpdateSuperheroRequest
): Promise<SuperheroDetails | null> => {
  try {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const superhero = await prisma.superhero.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          select: IMAGE_SELECT_FIELDS,
        },
      },
    });

    return transformSuperheroToDetails(superhero);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};

export const deleteSuperhero = async (id: string): Promise<boolean> => {
  try {
    await prisma.superhero.delete({
      where: { id },
    });
    return true;
  } catch (error: any) {
    if (error.code === 'P2025') {
      return false;
    }
    throw error;
  }
};

export const checkSuperheroExists = async (id: string): Promise<boolean> => {
  const count = await prisma.superhero.count({
    where: { id },
  });
  return count > 0;
};

export const checkNicknameExists = async (
  nickname: string,
  excludeId?: string
): Promise<boolean> => {
  const count = await prisma.superhero.count({
    where: {
      nickname,
      ...(excludeId && { NOT: { id: excludeId } }),
    },
  });
  return count > 0;
};
