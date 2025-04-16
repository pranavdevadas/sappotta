import express from 'express';
import { productController } from '../controller/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js';
const router = express.Router();

router.post("/add-product", authMiddleware, upload.single("productImage"), productController.createProduct);
router.get("/list-products", authMiddleware, productController.getAllProducts);
router.get("/my-products", authMiddleware, productController.getUserProducts);
router.put("/update/:id", authMiddleware, productController.updateProduct);
router.delete("/delete/:id", authMiddleware, productController.deleteProduct);

export default router;