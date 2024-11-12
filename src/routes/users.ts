import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';
import {
  userIdValidation,
  updateAvatarValidation,
  updateUserValidation,
} from '../validators/userValidation';

const router = Router();

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', userIdValidation, getUserById);
router.patch('/users/me', updateUserValidation, updateUser);
router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

export default router;
