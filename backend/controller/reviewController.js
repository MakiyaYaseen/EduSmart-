import Course from "../model/courseModel.js"
import Review from "../model/reviewModel.js"

export const createReview = async (req,res) => {
    try {
        const {rating , comment , courseId} = req.body 
        const userId = req.userId
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message:"Course is not found"})
        }
        const alreadyReviewed = await Review.findOne({course:courseId , user:userId})
        if(alreadyReviewed){
            return res.status(400).json({message:"You have already reviewed this course"})
        }
     const review = new Review({
  course: courseId,
  user: userId,
  rating,
  comment
})
await review.save()
course.reviews.push(review._id)
await course.save()

      return res.status(201).json(review)
    } catch (error) {
        return res.status(500).json({message:`Failed to create review ${error}`})
    }
}
export const getReviews = async (req, res) => {
    try {
        const { id } = req.params; 
        let reviews;

        if (id && id !== "undefined") {
            reviews = await Review.find({ course: id }).populate("course user").sort({ createdAt: -1 });
        } else {
            reviews = await Review.find().populate("course user").sort({ createdAt: -1 });
        }

        return res.status(200).json({
            success: true,
            reviews
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: `Failed to get review ${error}` });
    }
}