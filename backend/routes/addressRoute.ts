import express from 'express';  
import { authenticatedUser } from '../middleWare/authMiddleware';
import * as AddressController from '../controllers/addressController';

const router = express.Router();

router.post('/create-or-update', authenticatedUser, AddressController.createOrUpdateAddressByUserId);
router.get('/', authenticatedUser, AddressController.getAddressByUserId);

export default router;