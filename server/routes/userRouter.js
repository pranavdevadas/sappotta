import express from 'express';
import { userController } from '../controller/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.put('/profile/:id', authMiddleware, userController.updateUser)
router.delete('/profile/:id', authMiddleware, userController.deleteUser);
router.post("/block/:targetUserId", authMiddleware, userController.blockUser);
router.post("/unblock/:targetUserId", authMiddleware, userController.unblockUser);


export default router;