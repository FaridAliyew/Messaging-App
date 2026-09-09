import { Router } from 'express';
import {
  getOrCreateConversation,
  listMyConversations,
  getMessages,
  sendMessage,
} from '../controllers/conversationController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Protect all conversation routes
router.use(authenticate);

router.post('/', getOrCreateConversation);
router.get('/', listMyConversations);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

export default router;
