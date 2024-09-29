import express from 'express';
import { addEnquiry, editEnquiry, getEnquiry, getUserEnquiries } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddileware/authMiddleware.js';
import { validateAddEnquiry } from '../middlewares/validationMiddlewares/taskValidator.js';
const router = express.Router();

router.post('/addEnquiry',authenticateToken,validateAddEnquiry, addEnquiry);
router.get('/getUserEnquiries',authenticateToken, getUserEnquiries);
router.get('/getEnquiry/:id',authenticateToken, getEnquiry);
router.post('/editEnquiry',authenticateToken, editEnquiry);




export default router;
