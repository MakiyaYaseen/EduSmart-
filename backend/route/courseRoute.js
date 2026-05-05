import express from "express"
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorById, getCreatorCourses, getPublishedCourses, removeCourse, removeLecture, addQuizToCourse, getCourseAnalytics, getCourseGraduates } from "../controller/courseController.js"
import isAuth, { isEducator } from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import { searchWithAi } from "../controller/searchController.js"
const courseRouter = express.Router()

// Educator ONLY routes
courseRouter.post("/create", isAuth, isEducator, createCourse)
courseRouter.get("/getcreator", isAuth, isEducator, getCreatorCourses)
courseRouter.post("/editcourse/:courseId", isAuth, isEducator, upload.single("thumbnail"), editCourse)
courseRouter.delete("/remove/:courseId", isAuth, isEducator, removeCourse)
courseRouter.post("/:courseId/quiz", isAuth, isEducator, addQuizToCourse)
courseRouter.get("/analytics/:courseId", isAuth, isEducator, getCourseAnalytics)

// Lecture Educator routes
courseRouter.post("/createlecture/:courseId", isAuth, isEducator, createLecture)
courseRouter.post("/editlecture/:lectureId", isAuth, isEducator, upload.single("videoUrl"), editLecture)
courseRouter.delete("/removelecture/:lectureId", isAuth, isEducator, removeLecture)

// Public or Shared routes
courseRouter.get("/getpublished", getPublishedCourses)
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById)
courseRouter.get("/courselecture/:courseId", isAuth, getCourseLecture)
courseRouter.get("/graduates/:courseId", getCourseGraduates)
courseRouter.post("/creator", getCreatorById)

// AI Search
courseRouter.post("/search", searchWithAi)

export default courseRouter
