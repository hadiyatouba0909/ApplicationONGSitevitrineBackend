import { Router } from 'express';
import {
  getServices,
  getAllServices,
  createService,
  updateService,
  deleteService,
  serviceValidation,
} from '../controllers/serviceController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Routes publiques
router.get('/', getServices);

// Routes protégées (admin)
router.get('/admin', verifyToken, getAllServices);
router.post('/', verifyToken, serviceValidation, createService);
router.put('/:id', verifyToken, updateService);
router.delete('/:id', verifyToken, deleteService);

export default router;
