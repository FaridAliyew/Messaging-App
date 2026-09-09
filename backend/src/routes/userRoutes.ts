import { Router } from 'express';
import { listUsers, getUserById, updateMyProfile } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Protect all user routes
router.use(authenticate);

router.get('/', listUsers);
router.patch('/me', updateMyProfile); // Registered before /:id so 'me' is not captured as an :id param
router.get('/:id', getUserById);

export default router;
