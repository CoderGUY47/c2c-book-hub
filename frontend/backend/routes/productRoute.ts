import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import { multerMiddleware } from '../config/cloudinaryConfig';
import * as ProductController from '../controllers/productController';

const router = express.Router();

router.post('/', authenticatedUser,  multerMiddleware, ProductController.createProduct); // Create a new product
router.get('/', ProductController.getAllProducts); // Get all products
router.get('/:id', ProductController.getProductById); // Get product by ID and :id means dynamic id
router.delete('/seller/:productId', authenticatedUser, ProductController.deleteProduct); // Delete product by ID
router.get('/seller/:sellerId', authenticatedUser, ProductController.getProductBySellerId); // Get products by seller ID


export default router;