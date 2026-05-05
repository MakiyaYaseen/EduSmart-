import User from "../model/userModel.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";

// Mark lecture as complete (With 90% Watch-time Security)
export const markLectureComplete = async (req, res) => {
    try {
        const { courseId, lectureId, playedPercentage } = req.body;
        const userId = req.userId;

        if (playedPercentage < 90) {
            return res.status(400).json({
                message: "You haven't watched the full lecture. At least 90% watch time is required!"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }

        let isNewCourseProgress = false;
        let courseProgress = user.courseProgress.find(
            cp => cp.courseId.toString() === courseId
        );

        const course = await Course.findById(courseId);

        if (!courseProgress) {
            isNewCourseProgress = true;
            courseProgress = {
                courseId,
                completedLectures: [lectureId],
                lastWatchedLecture: lectureId,
                progressPercentage: course ? Math.round((1 / course.lectures.length) * 100) : 0,
                lectureWatchData: []
            };
            user.courseProgress.push(courseProgress);
        } else {
            const isAlreadyCompleted = courseProgress.completedLectures.some(
                id => id.toString() === lectureId
            );

            if (!isAlreadyCompleted) {
                courseProgress.completedLectures.push(lectureId);
            }

            courseProgress.lastWatchedLecture = lectureId;

            if (course && course.lectures.length > 0) {
                const completedCount = courseProgress.completedLectures.length;
                courseProgress.progressPercentage = Math.round((completedCount / course.lectures.length) * 100);
            }
        }

        // Extremely important: Use markModified only on the specific array items or save via updateOne to prevent race conditions.
        // The previous simple user.save() without specific atomic commands was overwriting concurrent background updates!
        if (isNewCourseProgress) {
            await User.updateOne(
                { _id: userId },
                { $push: { courseProgress: courseProgress } }
            );
        } else {
            await User.updateOne(
                { _id: userId, "courseProgress.courseId": courseId },
                {
                    $addToSet: { "courseProgress.$.completedLectures": lectureId },
                    $set: {
                        "courseProgress.$.lastWatchedLecture": lectureId,
                        "courseProgress.$.progressPercentage": courseProgress.progressPercentage
                    }
                }
            );
        }

        return res.status(200).json({
            message: "Lecture marked as complete",
            courseProgress
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

// Get user progress for a specific course
export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const user = await User.findById(userId)
            .populate({
                path: 'courseProgress.completedLectures',
                model: 'Lecture'
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const courseProgress = user.courseProgress.find(
            cp => cp.courseId.toString() === courseId
        );

        if (!courseProgress) {
            return res.status(200).json({
                completedLectures: [],
                lastWatchedLecture: null,
                progressPercentage: 0
            });
        }

        return res.status(200).json(courseProgress);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

// Update progress percentage (called after marking lecture complete)
export const updateProgressPercentage = async (req, res) => {
    try {
        const { courseId, totalLectures } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const courseProgress = user.courseProgress.find(
            cp => cp.courseId.toString() === courseId
        );

        if (courseProgress && totalLectures > 0) {
            const completedCount = courseProgress.completedLectures.length;
            courseProgress.progressPercentage = Math.round((completedCount / totalLectures) * 100);
            await user.save();

            return res.status(200).json({
                message: "Progress updated",
                progressPercentage: courseProgress.progressPercentage
            });
        }

        return res.status(404).json({ message: "Course progress not found" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};
// Submit Quiz Score
export const submitQuizScore = async (req, res) => {
    try {
        const { courseId, score } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const courseProgress = user.courseProgress.find(
            cp => cp.courseId.toString() === courseId
        );

        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found. Please watch lectures first." });
        }

        if (courseProgress.quizCompleted) {
            return res.status(400).json({ message: "Quiz already completed. You cannot re-attempt it." });
        }

        courseProgress.quizScore = score;
        courseProgress.quizCompleted = true;

        // Recalculate Final Score
        calculateFinalScore(user, courseId);

        user.markModified('courseProgress');
        await user.save();

        res.status(200).json({
            message: "Quiz score submitted",
            courseProgress
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
};

// Helper to calculate final score
export const calculateFinalScore = (user, courseId) => {
    const courseProgress = user.courseProgress.find(
        cp => cp.courseId.toString() === courseId
    );

    if (!courseProgress) return;

    const videoWeight = 0.4; // 40% Videos
    const quizWeight = 0.3;  // 30% Quiz
    const assignmentWeight = 0.3; // 30% Assignments

    const videoScore = courseProgress.progressPercentage || 0;
    const quizScore = courseProgress.quizScore || 0;
    const assignmentScore = courseProgress.assignmentScore || 0;

    // Final score is a weighted average
    // videoScore (0-100) * 0.4 = max 40 points
    // quizScore  (0-100) * 0.3 = max 30 points
    // assignmentScore (0-30)   = max 30 points (Educator gives marks out of 30)
    const total =
        (videoScore * videoWeight) +
        (quizScore * quizWeight) +
        assignmentScore;

    courseProgress.finalScore = Math.round(total);
};

// Update Video Watch Time (Resume Support)
export const updateVideoProgress = async (req, res) => {
    try {
        const { courseId, lectureId, currentTime, maxTime } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let courseProgressIndex = user.courseProgress.findIndex(cp => cp.courseId.toString() === courseId);

        // If courseProgress doesn't exist yet, we must initialize it so `updateVideoProgress` doesn't throw 404!
        if (courseProgressIndex === -1) {
            const initialCourseProgress = {
                courseId,
                completedLectures: [],
                lastWatchedLecture: lectureId,
                progressPercentage: 0,
                lectureWatchData: [{ lectureId, lastTime: currentTime, maxTime: maxTime }]
            };
            await User.updateOne(
                { _id: userId },
                { $push: { courseProgress: initialCourseProgress } }
            );
            return res.status(200).json({ message: "Progress initialized and updated" });
        }

        const courseProgress = user.courseProgress[courseProgressIndex];

        // Ensure watch data exists for this lecture
        const watchIndex = courseProgress.lectureWatchData.findIndex(ld => ld.lectureId.toString() === lectureId);

        if (watchIndex === -1) {
            await User.updateOne(
                { _id: userId, "courseProgress.courseId": courseId },
                {
                    $set: { "courseProgress.$.lastWatchedLecture": lectureId },
                    $push: { "courseProgress.$.lectureWatchData": { lectureId, lastTime: currentTime, maxTime: maxTime } }
                }
            );
        } else {
            // Only update if maxTime is greater
            const newMax = Math.max(courseProgress.lectureWatchData[watchIndex].maxTime, maxTime);

            // Use extremely precise positional indexing to ONLY touch the watch data for this specific lecture!
            // This absolutely guarantees that `completedLectures` array is untouched.
            const updatePathLastTime = `courseProgress.${courseProgressIndex}.lectureWatchData.${watchIndex}.lastTime`;
            const updatePathMaxTime = `courseProgress.${courseProgressIndex}.lectureWatchData.${watchIndex}.maxTime`;
            const updatePathLastWatched = `courseProgress.${courseProgressIndex}.lastWatchedLecture`;

            await User.updateOne(
                { _id: userId },
                {
                    $set: {
                        [updatePathLastTime]: currentTime,
                        [updatePathMaxTime]: newMax,
                        [updatePathLastWatched]: lectureId
                    }
                }
            );
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Progress update error", error);
        res.status(500).json({ message: error.message });
    }
}
