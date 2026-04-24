import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import * as WishlistController from '../controllers/wishListController';

const router = express.Router();

router.post('/add', authenticatedUser, WishlistController.addToWishlist);
router.delete('/remove/:productId', authenticatedUser, WishlistController.removeFromWishlist);
router.get('/:userId', authenticatedUser, WishlistController.getWishlistByUser);

export default router;



//cart files and wishlist file are almost same but cart is used to store products to buy and wishlist is used to store products to buy later