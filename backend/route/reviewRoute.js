import express from "express"
import isAuth, { isStudent } from "../middleware/isAuth.js"
import { createReview, getReviews } from "../controller/reviewController.js"
const reviewRouter = express.Router()

// Only students can create reviews for courses
reviewRouter.post("/createReview", isAuth, isStudent, createReview)
reviewRouter.get("/getreview", getReviews)
reviewRouter.get("/getreview/:id", getReviews)

export default reviewRouter;