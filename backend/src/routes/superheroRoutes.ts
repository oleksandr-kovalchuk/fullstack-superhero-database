import { Router } from 'express';
import * as superheroController from '../controllers/superheroController';
import { validateBody, validateQuery } from '../middleware/validation';
import { asyncHandler } from '../middleware/asyncHandler';
import { upload } from '../config/multer';
import {
  createSuperheroSchema,
  updateSuperheroSchema,
  paginationSchema,
} from '../validation/superhero';

const router = Router();

// GET /api/superheroes - Get all superheroes with pagination
router.get(
  '/',
  validateQuery(paginationSchema),
  asyncHandler(superheroController.getAllSuperheroes)
);

// GET /api/superheroes/:id - Get superhero by ID
router.get('/:id', asyncHandler(superheroController.getSuperheroById));

// POST /api/superheroes - Create new superhero
router.post(
  '/',
  upload.array('images', 10),
  validateBody(createSuperheroSchema),
  asyncHandler(superheroController.createSuperhero)
);

// PUT /api/superheroes/:id - Update superhero
router.put(
  '/:id',
  validateBody(updateSuperheroSchema),
  asyncHandler(superheroController.updateSuperhero)
);

// DELETE /api/superheroes/:id - Delete superhero
router.delete('/:id', asyncHandler(superheroController.deleteSuperhero));

// POST /api/superheroes/:id/images - Add images to superhero
router.post(
  '/:id/images',
  upload.array('images', 10),
  asyncHandler(superheroController.addImages)
);

// DELETE /api/superheroes/:id/images/:imageId - Remove image from superhero
router.delete(
  '/:id/images/:imageId',
  asyncHandler(superheroController.removeImage)
);

export { router as superheroRoutes };
