import express from 'express';
import { signUp, login, logOut, sendOTP, verifyOTP, resetPassword, googleAuth, sendSignUpOTP } from '../controller/authController.js';

const router = express.Router();

router.post('/send-signup-otp', sendSignUpOTP);
router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logOut);
router.post('/sendotp', sendOTP);
router.post('/verifyotp', verifyOTP);
router.post('/resetpassword', resetPassword);
router.post('/googleauth', googleAuth);
export default router;
