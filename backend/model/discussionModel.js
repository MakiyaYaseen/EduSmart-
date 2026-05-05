import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }, // Optional, can be tied to a specific lecture
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    replies: [replySchema],
    isResolved: { type: Boolean, default: false }
}, { timestamps: true });

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;
