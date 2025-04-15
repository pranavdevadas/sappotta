import express from 'express';
import { authController } from '../controller/authController.js';
import { upload } from '../middleware/uploadMiddleware.js';
const router = express.Router();

router.post('/register',upload.single('profilePhoto'), authController.register)
router.post('/login', authController.login)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.logout)


export default router;