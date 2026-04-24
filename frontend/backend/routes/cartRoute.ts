import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import * as CartController from '../controllers/cartController';

const router = express.Router();

router.post('/add', authenticatedUser, CartController.addToCart);
router.delete('/remove/:productId', authenticatedUser, CartController.removeFromCart);
router.get('/:userId', authenticatedUser, CartController.getCartByUser);

export default router;