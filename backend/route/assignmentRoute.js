import express from "express";
import {
    createAssignment,
    getCourseAssignments,
    submitAssignment,
    getAssignmentSubmissions,
    gradeSubmission,
    viewSubmissionFile
} from "../controller/assignmentController.js";
import isAuth, { isEducator, isStudent } from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Educator Routes
router.post("/create", isAuth, isEducator, createAssignment);
router.get("/submissions/:assignmentId", isAuth, isEducator, getAssignmentSubmissions);
router.get("/view-file/:submissionId", isAuth, isEducator, viewSubmissionFile);
router.put("/grade/:submissionId", isAuth, isEducator, gradeSubmission);

// Student Routes
router.post("/submit", isAuth, isStudent, upload.single("file"), submitAssignment);

// Shared Routes
router.get("/course/:courseId", isAuth, getCourseAssignments);

export default router;
