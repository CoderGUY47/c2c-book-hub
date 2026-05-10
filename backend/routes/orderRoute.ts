import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import * as OrderController from '../controllers/orderController';

const router = express.Router(); 

router.get('/', authenticatedUser, OrderController.getOrderByUser); // Get all orders for a user
router.get('/:id', authenticatedUser, OrderController.getOrderById); // Get product by ID
router.post('/', authenticatedUser, OrderController.createOrUpdateOrder); // Create or Update order
router.post('/ready-for-handover', authenticatedUser, OrderController.markOrderAsReady); // Seller marks ready
router.post('/verify-handover', authenticatedUser, OrderController.verifyHandoverCode); // Seller verifies QR

export default router;
