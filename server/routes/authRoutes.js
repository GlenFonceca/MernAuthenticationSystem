import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetPasswordOtp, sendVerifyOtp, verifyEmail } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetPasswordOtp);
authRouter.post('/reset-password',resetPassword);


export default authRouter;


