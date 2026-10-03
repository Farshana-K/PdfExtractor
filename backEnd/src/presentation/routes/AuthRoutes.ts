
import { Router } from 'express';
import { authController } from '../../factory/AppFactory.js';


const router = Router();

router.post('/register', authController.registerUser);
router.post('/verify-otp', authController.verifyOtpRequest);
router.post('/resend-otp', authController.resend);
router.post('/login', authController.loginUser);
router.post('/forgot-password', authController.forgotPasswordRequest);
router.post('/reset-password', authController.resetPasswordRequest);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export { router as authRoutes };

