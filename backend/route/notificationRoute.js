import express from 'express';
import { getUserNotifications, markAsRead, markAllAsRead, createAnnouncement } from '../controller/notificationController.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/', isAuth, getUserNotifications);
router.put('/read/:notificationId', isAuth, markAsRead);
router.put('/read-all', isAuth, markAllAsRead);
router.post('/announcement', isAuth, createAnnouncement);

export default router;
