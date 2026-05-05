import express from 'express';
import { getQuestionsForCourse, postQuestion, replyToQuestion } from '../controller/discussionController.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/course/:courseId', isAuth, getQuestionsForCourse);
router.post('/', isAuth, postQuestion);
router.post('/:discussionId/reply', isAuth, replyToQuestion);

export default router;
