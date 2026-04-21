import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import * as adminController from '../controllers/adminController';
import { isAdmin } from '../middleWare/adminMiddleware';

const router = express.Router();

// Apply both middleware to all admin routes
router.use(authenticatedUser, isAdmin);

// Dashboard stats route
router.get('/dashboard-stats', adminController.getDashboardStats);

//other management routes
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id', adminController.updateOrder);


//seller payment management routes
router.post('/process-seller-payment/:orderId', adminController.processSellerPayment);
router.get('/seller-payments', adminController.getSellerPayment);
router.get('/payment-transactions', adminController.getPaymentTransactions);


export default router;