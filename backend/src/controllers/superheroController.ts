import { Request, Response } from 'express';
import * as superheroService from '../services/superheroService';
import * as imageService from '../services/imageService';
import { CreateSuperheroRequest, UpdateSuperheroRequest } from '../types';

const createResponse = (
  success: boolean,
  data?: any,
  error?: string,
  message?: string,
  pagination?: any
) => ({
  success,
  ...(data && { data }),
  ...(error && { error }),
  ...(message && { message }),
  ...(pagination && { pagination }),
});

const validateFiles = (files: any): boolean => {
  return files && Array.isArray(files) && files.length > 0;
};

export const createSuperhero = async (req: Request, res: Response) => {
  const data: CreateSuperheroRequest = req.body;

  const nicknameExists = await superheroService.checkNicknameExists(
    data.nickname
  );
  if (nicknameExists) {
    return res
      .status(409)
      .json(
        createResponse(
          false,
          null,
          'Nickname already exists',
          'A superhero with this nickname already exists'
        )
      );
  }

  const superhero = await superheroService.createSuperhero(data);

  if (validateFiles(req.files)) {
    await imageService.addImagesToSuperhero(
      superhero.id,
      req.files as Express.Multer.File[]
    );
    const updatedSuperhero = await superheroService.getSuperheroById(
      superhero.id
    );
    return res.status(201).json(createResponse(true, updatedSuperhero));
  }

  res.status(201).json(createResponse(true, superhero));
};

export const getSuperheroById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const superhero = await superheroService.getSuperheroById(id);

  if (!superhero) {
    return res
      .status(404)
      .json(createResponse(false, null, 'Superhero not found'));
  }

  res.json(createResponse(true, superhero));
};

export const getAllSuperheroes = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const result = await superheroService.getAllSuperheroes(page, limit);

  res.json(
    createResponse(true, result.data, undefined, undefined, result.pagination)
  );
};

export const updateSuperhero = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateSuperheroRequest = req.body;

  const exists = await superheroService.checkSuperheroExists(id);
  if (!exists) {
    return res
      .status(404)
      .json(createResponse(false, null, 'Superhero not found'));
  }

  if (data.nickname) {
    const nicknameExists = await superheroService.checkNicknameExists(
      data.nickname,
      id
    );
    if (nicknameExists) {
      return res
        .status(409)
        .json(
          createResponse(
            false,
            null,
            'Nickname already exists',
            'A superhero with this nickname already exists'
          )
        );
    }
  }

  const superhero = await superheroService.updateSuperhero(id, data);

  res.json(createResponse(true, superhero));
};

export const deleteSuperhero = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await superheroService.deleteSuperhero(id);

  if (!deleted) {
    return res
      .status(404)
      .json(createResponse(false, null, 'Superhero not found'));
  }

  res.json(
    createResponse(true, undefined, undefined, 'Superhero deleted successfully')
  );
};

export const addImages = async (req: Request, res: Response) => {
  const { id } = req.params;

  const exists = await superheroService.checkSuperheroExists(id);
  if (!exists) {
    return res
      .status(404)
      .json(createResponse(false, null, 'Superhero not found'));
  }

  if (!validateFiles(req.files)) {
    return res
      .status(400)
      .json(createResponse(false, undefined, 'No images provided'));
  }

  await imageService.addImagesToSuperhero(
    id,
    req.files as Express.Multer.File[]
  );

  const images = await imageService.getSuperheroImages(id);

  res.json(
    createResponse(true, images, undefined, 'Images added successfully')
  );
};

export const removeImage = async (req: Request, res: Response) => {
  const { id, imageId } = req.params;

  const exists = await superheroService.checkSuperheroExists(id);
  if (!exists) {
    return res
      .status(404)
      .json(createResponse(false, null, 'Superhero not found'));
  }

  const removed = await imageService.removeImageFromSuperhero(imageId, id);

  if (!removed) {
    return res.status(404).json(createResponse(false, null, 'Image not found'));
  }

  res.json(
    createResponse(true, undefined, undefined, 'Image removed successfully')
  );
};
