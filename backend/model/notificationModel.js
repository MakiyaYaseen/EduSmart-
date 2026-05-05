import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['system', 'announcement', 'reply', 'assignment_graded'], default: 'system' },
    isRead: { type: Boolean, default: false },
    link: { type: String } // Optional link to redirect the user when clicked (e.g., to a course or discussion thread)
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
