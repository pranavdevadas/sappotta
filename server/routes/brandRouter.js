import express from 'express';
import { brandController } from '../controller/brandController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
const router = express.Router();

router.post('/add-brand', authMiddleware, upload.single('brandLogo'), brandController.createBrand); 
router.get('/list-brands', brandController.allBrands); 

export default router;