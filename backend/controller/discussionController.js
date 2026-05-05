import Discussion from '../model/discussionModel.js';
import Notification from '../model/notificationModel.js';
import Course from '../model/courseModel.js';

export const getQuestionsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const discussions = await Discussion.find({ courseId })
            .populate('userId', 'name photoUrl')
            .populate('replies.userId', 'name photoUrl role')
            .sort({ createdAt: -1 });
        res.status(200).json(discussions);
    } catch (error) {
        console.error("Error fetching discussions", error);
        res.status(500).json({ message: "Failed to fetch discussions", error: error.message });
    }
};

export const postQuestion = async (req, res) => {
    try {
        const { courseId, title, text, lectureId } = req.body;
        const userId = req.userId;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const discussion = await Discussion.create({
            courseId,
            userId,
            title,
            text,
            lectureId: lectureId || null
        });

        const newDiscussion = await Discussion.findById(discussion._id)
            .populate('userId', 'name photoUrl');

        // Optional: Notify the creator of the course
        if (course.creator && course.creator.toString() !== userId.toString()) {
            await Notification.create({
                userId: course.creator,
                title: "New Student Question",
                message: `A student asked a new question: "${title}" in course: ${course.title}`,
                type: 'system',
                link: `/manage-qa/${courseId}`
            });
        }

        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error("Error posting question", error);
        res.status(500).json({ message: "Failed to post question", error: error.message });
    }
};

export const replyToQuestion = async (req, res) => {
    try {
        const { discussionId } = req.params;
        const { text } = req.body;
        const userId = req.userId;

        const discussion = await Discussion.findById(discussionId).populate('courseId');
        if (!discussion) return res.status(404).json({ message: "Discussion not found" });

        discussion.replies.push({ userId, text });
        await discussion.save();

        const updatedDiscussion = await Discussion.findById(discussionId)
            .populate('userId', 'name photoUrl')
            .populate('replies.userId', 'name photoUrl role');

        // Notify the original question author if someone else replied
        if (discussion.userId.toString() !== userId.toString()) {
            await Notification.create({
                userId: discussion.userId,
                title: "New Reply",
                message: `Someone replied to your question: "${discussion.title}"`,
                type: 'reply',
                link: `/viewlecture/${discussion.courseId._id || discussion.courseId}`
            });
        }

        res.status(200).json(updatedDiscussion);
    } catch (error) {
        console.error("Error replying to discussion", error);
        res.status(500).json({ message: "Failed to post reply", error: error.message });
    }
};
