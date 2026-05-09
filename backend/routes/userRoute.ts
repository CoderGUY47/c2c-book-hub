import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import * as UserController from '../controllers/userController';
import { multerMiddleware } from '../config/cloudinaryConfig';

const router = express.Router();

router.put('/profile/update/:userId', authenticatedUser, multerMiddleware, UserController.updateUserProfile);


export default router;