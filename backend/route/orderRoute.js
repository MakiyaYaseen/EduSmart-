import express from 'express';
import { createStripeOrder, enrollUser } from '../controller/orderController.js';
import isAuth, { isStudent } from '../middleware/isAuth.js';
const router = express.Router();

// Only students can create orders and enroll in courses
router.post('/create-stripe-order', isAuth, isStudent, createStripeOrder);
router.post('/enroll-user', isAuth, isStudent, enrollUser);

export default router;