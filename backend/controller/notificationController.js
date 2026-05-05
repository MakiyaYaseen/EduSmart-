import Notification from '../model/notificationModel.js';
import User from '../model/userModel.js';

export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications", error);
        res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;

        await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error marking notification read", error);
        res.status(500).json({ message: "Failed to update notification", error: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;

        await Notification.updateMany(
            { userId },
            { isRead: true }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error marking all notifications read", error);
        res.status(500).json({ message: "Failed to update notifications", error: error.message });
    }
};

export const createAnnouncement = async (req, res) => {
    try {
        const { courseId, title, message } = req.body;
        const educatorId = req.userId;

        // Ensure user is educator
        const user = await User.findById(educatorId);
        if (!user || user.role !== 'educator') {
            return res.status(403).json({ message: "Only educators can create announcements" });
        }

        // Find all students enrolled in this course
        const students = await User.find({ "enrolledCourses": courseId });

        const notifications = students.map(student => ({
            userId: student._id,
            title,
            message,
            type: 'announcement',
            link: `/viewlecture/${courseId}`
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({ success: true, message: `Announcement sent to ${notifications.length} students` });
    } catch (error) {
        console.error("Error creating announcement", error);
        res.status(500).json({ message: "Failed to create announcement", error: error.message });
    }
};
