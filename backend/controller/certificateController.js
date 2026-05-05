import User from "../model/userModel.js";
import Course from "../model/courseModel.js";

export const getCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: "User or Course not found" });
        }

        const courseProgress = user.courseProgress.find(
            cp => cp.courseId.toString() === courseId
        );

        if (!courseProgress || courseProgress.progressPercentage < 100) {
            return res.status(400).json({ message: "Course not completed yet" });
        }

        const certificateData = {
            studentName: user.name,
            courseTitle: course.title,
            completionDate: courseProgress.updatedAt || new Date(),
            certificateId: `CERT-${courseId.slice(-4)}-${userId.slice(-4)}-${Date.now().toString().slice(-4)}`,
            finalScore: courseProgress.finalScore || 0,
            quizScore: courseProgress.quizScore || 0,
            assignmentScore: courseProgress.assignmentScore || 0,
            assignmentFeedback: courseProgress.assignmentFeedback || "",
            videoScore: courseProgress.progressPercentage || 0
        };

        if (courseProgress.certificateIssued) {
            // We can still return the cert data, but maybe they shouldn't be generating a new ID.
            // Actually, if they want to view it again, we should allow viewing.
        }

        // Set certificate as issued
        courseProgress.certificateIssued = true;
        user.markModified('courseProgress');
        await user.save();

        res.status(200).json(certificateData);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
