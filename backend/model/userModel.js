import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    description: { type: String },

    email: { type: String, required: true, unique: true },

    password: { type: String, },

    role: {
        type: String,
        enum: ["student", "educator"],
        required: true
    },

    photoUrl: { type: String, default: "" },

    enrolledCourses: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    ],

    // Track progress for each course
    courseProgress: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
        lastWatchedLecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
        progressPercentage: { type: Number, default: 0 },  // Video progress %
        quizScore: { type: Number, default: null },          // Quiz score (0-100)
        quizCompleted: { type: Boolean, default: false },    // Quiz attempt hua?
        assignmentScore: { type: Number, default: null },    // Educator given avg % (0-100)
        assignmentFeedback: { type: String, default: "" },
        finalScore: { type: Number, default: null },         // Combined final score
        certificateIssued: { type: Boolean, default: false },
        completedAt: { type: Date },
        lectureWatchData: [{
            lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
            lastTime: { type: Number, default: 0 }, // Resume point
            maxTime: { type: Number, default: 0 }   // Security checkpoint
        }]
    }],

    resetOtp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },


}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
