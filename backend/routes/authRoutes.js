import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { verifyOtp } from '../controllers/otpController.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/verify-otp', verifyOtp);

export default authRouter;