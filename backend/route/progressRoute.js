import express from 'express';
import { markLectureComplete, getCourseProgress, updateProgressPercentage, submitQuizScore, updateVideoProgress } from '../controller/progressController.js';
import isAuth, { isStudent } from '../middleware/isAuth.js';

const router = express.Router();

// Only students can track progress or mark lectures as complete
router.post('/mark-complete', isAuth, isStudent, markLectureComplete);
router.get('/course/:courseId', isAuth, isStudent, getCourseProgress);
router.post('/update-percentage', isAuth, isStudent, updateProgressPercentage);
router.post('/submit-quiz', isAuth, isStudent, submitQuizScore);
router.post('/update-video-progress', isAuth, isStudent, updateVideoProgress);

export default router;
