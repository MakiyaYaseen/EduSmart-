import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deadline: { type: Date }
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
