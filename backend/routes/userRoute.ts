import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import * as UserController from '../controllers/userController';

const router = express.Router();

router.put('/profile/update/:userId', authenticatedUser, UserController.updateUserProfile);
router.post('/institution-info', authenticatedUser, UserController.saveInstitutionInfo);

export default router;