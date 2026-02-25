import { Router } from 'express';
import {
  sendContact,
  getMessages,
  markAsRead,
  deleteMessage,
  contactValidation,
} from '../controllers/contactController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Route publique - envoyer un message
router.post('/', contactValidation, sendContact);

// Routes protégées - gestion des messages
router.get('/messages', verifyToken, getMessages);
router.patch('/messages/:id/lu', verifyToken, markAsRead);
router.delete('/messages/:id', verifyToken, deleteMessage);

export default router;
