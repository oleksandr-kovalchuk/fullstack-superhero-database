import { Request, Response } from 'express';
import * as superheroService from '../services/superheroService';
import * as imageService from '../services/imageService';
import { CreateSuperheroRequest, UpdateSuperheroRequest } from '../types';

export const createSuperhero = async (req: Request, res: Response) => {
  const data: CreateSuperheroRequest = req.body;

  // Check if nickname already exists
  const nicknameExists = await superheroService.checkNicknameExists(
    data.nickname
  );
  if (nicknameExists) {
    return res.status(409).json({
      success: false,
      error: 'Nickname already exists',
      message: 'A superhero with this nickname already exists',
    });
  }

  const superhero = await superheroService.createSuperhero(data);

  // Handle file uploads if present
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    await imageService.addImagesToSuperhero(superhero.id, req.files);
    // Refetch superhero with images
    const updatedSuperhero = await superheroService.getSuperheroById(
      superhero.id
    );
    return res.status(201).json({
      success: true,
      data: updatedSuperhero,
    });
  }

  res.status(201).json({
    success: true,
    data: superhero,
  });
};

export const getSuperheroById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const superhero = await superheroService.getSuperheroById(id);

  if (!superhero) {
    return res.status(404).json({
      success: false,
      error: 'Superhero not found',
    });
  }

  res.json({
    success: true,
    data: superhero,
  });
};

export const getAllSuperheroes = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const result = await superheroService.getAllSuperheroes(page, limit);

  res.json({
    success: true,
    ...result,
  });
};

export const updateSuperhero = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateSuperheroRequest = req.body;

  // Check if superhero exists
  const exists = await superheroService.checkSuperheroExists(id);
  if (!exists) {
    return res.status(404).json({
      success: false,
      error: 'Superhero not found',
    });
  }

  // Check if nickname already exists (if nickname is being updated)
  if (data.nickname) {
    const nicknameExists = await superheroService.checkNicknameExists(
      data.nickname,
      id
    );
    if (nicknameExists) {
      return res.status(409).json({
        success: false,
        error: 'Nickname already exists',
        message: 'A superhero with this nickname already exists',
      });
    }
  }

  const superhero = await superheroService.updateSuperhero(id, data);

  res.json({
    success: true,
    data: superhero,
  });
};

export const deleteSuperhero = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await superheroService.deleteSuperhero(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Superhero not found',
    });
  }

  res.json({
    success: true,
    message: 'Superhero deleted successfully',
  });
};

export const addImages = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if superhero exists
  const exists = await superheroService.checkSuperheroExists(id);
  if (!exists) {
    return res.status(404).json({
      success: false,
      error: 'Superhero not found',
    });
  }

  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No images provided',
    });
  }

  await imageService.addImagesToSuperhero(id, req.files);

  const images = await imageService.getSuperheroImages(id);

  res.json({
    success: true,
    message: 'Images added successfully',
    data: images,
  });
};

export const removeImage = async (req: Request, res: Response) => {
  const { id, imageId } = req.params;

  // Check if superhero exists
  const exists = await superheroService.checkSuperheroExists(id);
  if (!exists) {
    return res.status(404).json({
      success: false,
      error: 'Superhero not found',
    });
  }

  const removed = await imageService.removeImageFromSuperhero(imageId, id);

  if (!removed) {
    return res.status(404).json({
      success: false,
      error: 'Image not found',
    });
  }

  res.json({
    success: true,
    message: 'Image removed successfully',
  });
};
