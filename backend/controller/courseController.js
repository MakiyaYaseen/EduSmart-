import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/userModel.js";

//  CREATE COURSE 
export const createCourse = async (req, res) => {
    try {
        const { title, category, description } = req.body;
        if (!title || !category) {
            return res.status(400).json({ message: "Title or Category is required" });
        }
        const course = await Course.create({
            title,
            category,
            description,
            creator: req.userId
        });
        return res.status(201).json(course);
    } catch (error) {
        return res.status(500).json({ message: `CreateCourse error ${error}` });
    }
};
//  ALL PUBLISHED COURSES 
export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .populate("lectures")
            .populate({
                path: "reviews",
                populate: { path: "user", select: "name photoUrl description" }
            })
            .populate("creator", "name email photoUrl description");
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get isPublished Courses ${error}` });
    }
};

//  CREATOR COURSES 
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId;
        const courses = await Course.find({ creator: userId });
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get Creator Courses ${error}` });
    }
};

//  EDIT COURSE 
export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, subTitle, description, category, level, isPublished, price } = req.body;

        let thumbnail;
        if (req.file) {
            thumbnail = await uploadOnCloudinary(req.file.path);
        }

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course is not found" });
        }

        const updateData = { title, subTitle, description, category, level, isPublished, price };

        if (thumbnail) updateData.thumbnail = thumbnail;

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Course ${error}` });
    }
};

//  GET COURSE BY ID 
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId)
            .populate("lectures")
            .populate({
                path: "reviews",
                populate: { path: "user", select: "name photoUrl description" }
            })
            .populate("creator", "name email photoUrl description");
        if (!course) {
            return res.status(400).json({ message: "Course is not found" });
        }
        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get CourseById ${error}` });
    }
};


//  REMOVE COURSE 
export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course is not found" });
        }

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({ message: "Course deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Failed to delete course: ${error}` });
    }
};

//  CREATE LECTURE  ✅ Fixed
export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle) {
            return res.status(400).json({ message: "Lecture title is required" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const lecture = await Lecture.create({ lectureTitle });

        course.lectures.push(lecture._id);
        await course.save();

        return res.status(201).json({ lecture, course });

    } catch (error) {
        console.error("CreateLecture error:", error);
        return res.status(500).json({ message: `Failed to create lecture ${error.message}` });
    }
};

//  GET LECTURES OF A COURSE
export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course is not found" });
        }

        await course.populate("lectures");
        await course.save();

        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to getCourseLecture ${error}` });
    }
};

//  EDIT LECTURE 
export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { isPreviewFree, lectureTitle } = req.body;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture is not found" });
        }

        if (req.file) {
            const videoUrl = await uploadOnCloudinary(req.file.path);
            lecture.videoUrl = videoUrl;
        }

        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle;
        }

        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        return res.status(200).json(lecture);

    } catch (error) {
        return res.status(500).json({ message: `Failed to edit lecture ${error}` });
    }
};

//  REMOVE LECTURE
export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        await Lecture.findByIdAndDelete(lectureId);

        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        );

        return res.status(200).json({ message: "Lecture Removed" });

    } catch (error) {
        return res.status(500).json({ message: `Failed to remove lecture ${error}` });
    }
};
// get creator
export const getCreatorById = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: "userId is required" })
        }

        const user = await User.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get creator ${error}` })
    }
}
export const addQuizToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { quizArray } = req.body;

        const course = await Course.findByIdAndUpdate(
            courseId,
            { quiz: quizArray },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Quiz updated successfully", course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseGraduates = async (req, res) => {
    try {
        const { courseId } = req.params;
        // Find users who have 100% progress in this course
        const users = await User.find({
            "courseProgress": {
                $elemMatch: {
                    courseId: courseId,
                    progressPercentage: 100
                }
            }
        }).select("name photoUrl _id").limit(10);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;
        const students = await User.find({ "enrolledCourses": courseId });

        const studentProgressData = students.map(user => {
            const courseProgress = user.courseProgress.find(cp => cp.courseId.toString() === courseId);
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                videoProgress: courseProgress ? (courseProgress.progressPercentage || 0) : 0,
                quizScore: courseProgress ? (courseProgress.quizScore || 0) : 0,
                assignmentScore: courseProgress ? (courseProgress.assignmentScore || 0) : 0,
                finalGrade: courseProgress ? (courseProgress.finalScore || 0) : 0,
                certificateIssued: courseProgress ? courseProgress.certificateIssued : false
            };
        });

        const issuedCertificates = studentProgressData.filter(s => s.certificateIssued).length;
        const totalProgress = studentProgressData.reduce((acc, curr) => acc + curr.videoProgress, 0);
        const averageProgress = studentProgressData.length > 0 ? (totalProgress / studentProgressData.length).toFixed(1) : 0;

        res.status(200).json({
            students: studentProgressData,
            stats: {
                issuedCertificates,
                averageProgress,
                totalStudents: studentProgressData.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};