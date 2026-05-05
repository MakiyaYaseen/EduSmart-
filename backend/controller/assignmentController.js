import Assignment from "../model/assignmentModel.js";
import Submission from "../model/submissionModel.js";
import Course from "../model/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";
import Notification from "../model/notificationModel.js";
import { calculateFinalScore } from "./progressController.js";
import https from 'https';
import http from 'http';
import { v2 as cloudinary } from 'cloudinary';



export const createAssignment = async (req, res) => {
    try {
        const { title, description, fileUrl, courseId, deadline } = req.body;
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(23, 59, 59, 999);
        const assignment = await Assignment.create({
            title,
            description,
            fileUrl,
            course: courseId,
            creator: req.userId,
            deadline: deadlineDate
        });
        res.status(201).json({ message: "Assignment created successfully", assignment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getCourseAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;
        const assignments = await Assignment.find({ course: courseId }).lean();

        const submissions = await Submission.find({
            student: userId,
            assignment: { $in: assignments.map(a => a._id) }
        }).lean();

        const assignmentsWithStatus = assignments.map(assignment => {
            const submission = submissions.find(s => s.assignment.toString() === assignment._id.toString());
            return {
                ...assignment,
                isSubmitted: !!submission,
                submissionDetails: submission || null
            };
        });

        res.status(200).json(assignmentsWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, content } = req.body;
        let fileUrl = req.body.fileUrl;
        console.log("Submitting assignment:", assignmentId);
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            console.log("Assignment not found in DB:", assignmentId);
            return res.status(404).json({ message: "Assignment not found" });
        }
        const existingSubmission = await Submission.findOne({
            assignment: assignmentId,
            student: req.userId
        });

        if (existingSubmission) {
            return res.status(400).json({ message: "You have already submitted this assignment!" });
        }
        if (assignment.deadline) {
            const now = new Date();
            const deadlineDate = new Date(assignment.deadline);
            if (deadlineDate.getHours() === 0 && deadlineDate.getMinutes() === 0) {
                deadlineDate.setHours(23, 59, 59, 999);
            }
            if (now > deadlineDate) {
                console.log("Deadline passed for:", assignmentId);
                return res.status(400).json({
                    message: "Deadline has passed! You can no longer submit this assignment."
                });
            }
        }
        if (req.file) {
            console.log("Uploading file to Cloudinary:", req.file.path);
            fileUrl = await uploadOnCloudinary(req.file.path);
        }

        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.userId,
            fileUrl,
            content
        });

        console.log("Submission created successfully:", submission._id);
        res.status(201).json({ message: "Assignment submitted successfully", submission });
    } catch (error) {
        console.error("Submission error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get Submissions for an Assignment (Educator Only)
export const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await Submission.find({ assignment: assignmentId }).populate("student", "name email");
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Grade Submission (Educator Only)
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback, score } = req.body;

        const submission = await Submission.findById(submissionId).populate("assignment");
        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        if (!submission.assignment) {
            return res.status(404).json({ message: "Assignment for this submission was not found" });
        }

        submission.grade = grade || `${score}/30`;
        submission.feedback = feedback || "";
        submission.score = score || 0;
        await submission.save();

        // Update User Progress
        const userId = submission.student;
        const courseId = submission.assignment.course;

        if (userId && courseId) {
            const user = await User.findById(userId);
            if (user) {
                const courseProgress = user.courseProgress.find(
                    cp => cp.courseId && cp.courseId.toString() === courseId.toString()
                );

                if (courseProgress) {
                    // Get all assignments for this course to calculate average
                    const allAssignments = await Assignment.find({ course: courseId });
                    const allSubmissions = await Submission.find({
                        student: userId,
                        assignment: { $in: allAssignments.map(a => a._id) }
                    });

                    let totalScore = 0;
                    let feedbacks = [];
                    
                    if (allAssignments.length > 0) {
                        allAssignments.forEach(assignment => {
                            const sub = allSubmissions.find(s => s.assignment.toString() === assignment._id.toString());
                            totalScore += sub ? (sub.score || 0) : 0;
                            if (sub && sub.feedback) {
                                feedbacks.push(sub.feedback);
                            }
                        });

                        courseProgress.assignmentScore = Math.round(totalScore / allAssignments.length);
                        courseProgress.assignmentFeedback = feedbacks.length > 0 ? feedbacks.join(' | ') : "";

                        // Recalculate Final Score
                        calculateFinalScore(user, courseId.toString());

                        user.markModified('courseProgress');
                        await user.save();

                        // Send Notification to Student
                        await Notification.create({
                            userId: userId,
                            title: "Assignment Graded!",
                            message: `Your assignment "${submission.assignment.title}" has been graded with ${grade}.`,
                            type: "assignment_graded",
                            link: `/viewlecture/${courseId}`
                        });
                    }
                }
            }
        }

        res.status(200).json({ message: "Submission graded and progress updated", submission });
    } catch (error) {
        console.error("Grading Error:", error);
        res.status(500).json({ message: error.message || "Failed to grade submission" });
    }
};

// Redirect to the file URL directly
export const viewSubmissionFile = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const submission = await Submission.findById(submissionId);
        
        if (!submission || !submission.fileUrl) {
            return res.status(404).json({ message: "Submission or file not found" });
        }

        console.log("Redirecting to original URL:", submission.fileUrl);
        
        // Since Cloudinary security settings now allow PDF delivery, 
        // we can directly redirect to the original URL stored in the DB.
        // This ensures the browser gets the exact URL with the .pdf extension
        // and renders it natively.
        res.redirect(submission.fileUrl);

    } catch (error) {
        console.error("View file error:", error);
        res.status(500).json({ message: error.message });
    }
};
