import { Router } from 'express';
import {
  getActivites,
  getAllActivites,
  createActivite,
  updateActivite,
  deleteActivite,
  activityValidation,
} from '../controllers/activityController';
import { verifyToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Routes publiques
router.get('/', getActivites);

// Routes protégées (admin)
router.get('/admin', verifyToken, getAllActivites);
router.post('/', verifyToken, upload.single('image'), activityValidation, createActivite);
router.put('/:id', verifyToken, upload.single('image'), updateActivite);
router.delete('/:id', verifyToken, deleteActivite);

export default router;
