import mongoose, { mongo } from "mongoose";
const courseSchema = mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   subTitle: {
      type: String
   },
   description: {
      type: String
   },
   category: {
      type: String,
      required: true   
   },
   level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"]
   },
   price: {
      type: Number
   },
   thumbnail: {
      type: String  
   },
   enrolledStudent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   }],
   lectures: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture"
   }],
   creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   isPublished: {
      type: Boolean,
      default: false
   },
   reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
   }],
   quiz: [
      {
         question: { type: String, required: true },
         options: [{ type: String, required: true }], 
         correctAnswer: { type: String, required: true }
      }
   ],
}, { timestamps: true });
const Course = mongoose.model("Course" , courseSchema)
export default Course
