import express from 'express';
import { adminLogin, userLogin } from '../controllers/authController.js';
import { validateUserLogin , validateAdminLogin} from '../middlewares/validationMiddlewares/loginValidator.js';
import { loginLimiter } from '../middlewares/limiterMiddilewares/loginLimiterMiddleware.js';
const router = express.Router();

router.post('/login', loginLimiter,validateUserLogin, userLogin);
router.post('/adminLogin', loginLimiter,validateAdminLogin, adminLogin);


export default router;
