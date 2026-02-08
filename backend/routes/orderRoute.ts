import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import * as OrderController from '../controllers/orderController';

const router = express.Router(); 

router.get('/', authenticatedUser, OrderController.getOrderByUser); // Get all orders for a user
router.get('/:id', authenticatedUser, OrderController.getOrderById); // Get product by ID
router.post('/', authenticatedUser, OrderController.createOrUpdateOrder); // Create or Update order

export default router;
