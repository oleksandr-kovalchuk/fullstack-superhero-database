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

router.get(
  '/',
  validateQuery(paginationSchema),
  asyncHandler(superheroController.getAllSuperheroes)
);

router.get('/:id', asyncHandler(superheroController.getSuperheroById));

router.post(
  '/',
  upload.array('images', 10),
  validateBody(createSuperheroSchema),
  asyncHandler(superheroController.createSuperhero)
);

router.put(
  '/:id',
  validateBody(updateSuperheroSchema),
  asyncHandler(superheroController.updateSuperhero)
);

router.delete('/:id', asyncHandler(superheroController.deleteSuperhero));

router.post(
  '/:id/images',
  upload.array('images', 10),
  asyncHandler(superheroController.addImages)
);

router.delete(
  '/:id/images/:imageId',
  asyncHandler(superheroController.removeImage)
);

export { router as superheroRoutes };
