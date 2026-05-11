import React, { useState, useEffect } from 'react'
import { FaArrowLeftLong, FaStar } from "react-icons/fa6";
import { FaPlayCircle, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setSelectedCourse } from '../redux/courseSlice'
import img from "../assets/empty.jpg"
import axios from 'axios'
import { serverUrl } from '../constants'
import Card from '../component/Card'
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import CardReview from '../component/ReviewCard.jsx'
import { IoRibbonOutline, IoHelpCircleOutline, IoDocumentTextOutline, IoPeopleOutline, IoTimeOutline, IoCheckmarkCircle } from 'react-icons/io5'


const ViewCourse = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { courseId } = useParams()

  const { courseData, selectedCourse } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)

  const [selectedLecture, setSelectedLecture] = useState(null)
  const [creatorData, setCreatorData] = useState(null)
  const [creatorCourses, setCreatorCourses] = useState(null)

  const [enrolledNow, setEnrolledNow] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false);
  const [graduates, setGraduates] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("success") === "true") {
      setEnrolledNow(true)
    }
  }, [])

  const isEnrolled =
    enrolledNow ||
    selectedCourse?.enrolledStudent?.some(id =>
      String(id._id || id) === String(userData?._id)
    ) ||
    userData?.enrolledCourses?.some(c =>
      String(c._id || c) === String(courseId))

  const fetchCourseData = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true })
      dispatch(setSelectedCourse(res.data))
    } catch (error) {
      console.log("Fetch course error:", error)
    }
  }

  useEffect(() => {
    if (courseData?.length) {
      fetchCourseData()
    }
  }, [courseData, courseId])

  useEffect(() => {
    if (!selectedCourse?.creator) return
    const handleCreator = async () => {
      try {
        const creatorId = selectedCourse.creator._id || selectedCourse.creator
        const result = await axios.post(
          serverUrl + "/api/course/creator",
          { userId: creatorId },
          { withCredentials: true }
        )
        setCreatorData(result.data)
      } catch (error) {
        console.log(error)
      }
    }
    handleCreator()
  }, [selectedCourse?.creator])

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const filteredCourses = courseData.filter(course => {
        const courseCreatorId = course.creator._id || course.creator
        return courseCreatorId === creatorData._id && course._id !== courseId
      })
      setCreatorCourses(filteredCourses)
    }
  }, [creatorData, courseData, courseId])

  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/course/graduates/${courseId}`)
        setGraduates(res.data)
      } catch (error) {
        console.log("Fetch graduates error:", error)
      }
    }
    if (courseId) fetchGraduates()
  }, [courseId])

  const handleEnrollNow = async () => {
    if (userData?.role === "educator") {
      toast.error("Educators cannot enroll in courses. Please use a student account.");
      return;
    }
    try {
      const response = await axios.post(
        `${serverUrl}/api/order/create-stripe-order`,
        {
          courseId: selectedCourse._id,
          title: selectedCourse.title,
          price: selectedCourse.price,
          thumbnail: selectedCourse.thumbnail
        },
        { withCredentials: true }
      )

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url
      }
    } catch (error) {
      console.error("Enrollment error:", error)
    }
  }

  const handleSubmitReview = async () => {
    if (!rating || !comment) {
      toast.error("Please give rating and comment");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/review/createReview`,
        { courseId: selectedCourse._id, rating, comment },
        { withCredentials: true }
      );

      toast.success("Review added successfully");
      setRating(0);
      setComment("");
      fetchCourseData(); // Refresh data taake naya review show ho jaye
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setRating(0);
    setComment("");
    setSelectedLecture(null);
  }, [courseId]);

  const caluculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }
  const avgRating = caluculateAvgReview(selectedCourse?.reviews)


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen pt-[120px] pb-20 relative overflow-hidden'
    >
      {/* Background Shapes */}
      <div className='bg-shape bg-indigo-500 w-[600px] h-[600px] top-[-10%] right-[-20%] opacity-20'></div>
      <div className='bg-shape bg-teal-500 w-[500px] h-[500px] bottom-[10%] left-[-10%] opacity-20'></div>

      <div className='max-w-7xl mx-auto px-4 md:px-8 space-y-8 relative z-10'>

        {/* Course Header Section */}
        <div className='glass-effect rounded-3xl overflow-hidden border-white/20 shadow-xl transition-all'>
          <div className='flex flex-col lg:flex-row'>

            {/* Thumbnail */}
            <div className='lg:w-1/2 relative bg-black flex items-center justify-center min-h-[300px]'>
              <div
                className='absolute top-6 left-6 text-white bg-black/50 p-2 rounded-full w-10 h-10 cursor-pointer z-10 hover:bg-black transition-all flex items-center justify-center backdrop-blur-md'
                onClick={() => navigate("/")}
              >
                <FaArrowLeftLong />
              </div>
              <img
                src={selectedCourse?.thumbnail || img}
                className='w-full h-full object-cover opacity-90'
                alt={selectedCourse?.title}
              />
            </div>

            {/* Basic Info */}
            <div className='flex-1 p-8 lg:p-12 space-y-6 bg-white/40 dark:bg-black/40 backdrop-blur-sm'>
              <div className='space-y-4'>
                <span className='px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-black rounded-full uppercase tracking-wider border border-indigo-500/20'>
                  {selectedCourse?.category}
                </span>
                <h1 className='text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight'>
                  {selectedCourse?.title}
                </h1>
                <p className='text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium'>
                  {selectedCourse?.subTitle || "Unlock your potential with this comprehensive course designed for masters and beginners alike."}
                </p>
              </div>

              <div className='flex flex-wrap items-center gap-6'>
                <div className='flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-2xl border border-yellow-500/20'>
                  <FaStar className='text-yellow-500 text-xl' />
                  <span className='text-yellow-700 dark:text-yellow-500 font-bold text-lg'>{avgRating}</span>
                  <span className='text-yellow-600/60 dark:text-yellow-500/60 text-sm font-semibold'>(1,200+ Reviews)</span>
                </div>

                <div className='flex items-baseline gap-2'>
                  <span className='text-3xl font-black text-gray-900 dark:text-white'>PKR {selectedCourse?.price}</span>
                  <span className='text-gray-400 line-through text-lg font-medium'>PKR 3,999</span>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                {isEnrolled ? (
                  <button
                    onClick={() => navigate(`/viewlecture/${courseId}`)}
                    className='flex-1 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 active:scale-95'
                  >
                    <FaPlayCircle /> Start Learning
                  </button>
                ) : userData?.role === "educator" ? (
                  <button
                    disabled
                    className='flex-1 bg-gray-400 dark:bg-zinc-700 text-white cursor-not-allowed px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2'
                  >
                    <FaLock /> Enrollment Disabled for Educators
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollNow}
                    className='flex-1 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2'
                  >
                    Enroll Now
                  </button>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4 text-sm font-bold text-gray-600 dark:text-gray-400'>
                <div className='flex items-center gap-2'>✅ 10+ hours of video</div>
                <div className='flex items-center gap-2'>✅ Lifetime access</div>
                <div className='flex items-center gap-2'>✅ Expert support</div>
                <div className='flex items-center gap-2'>✅ Certificate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Features - Why this course? */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            { icon: <IoHelpCircleOutline />, title: "Interactive Quizzes", desc: "Test your knowledge after each module with AI-powered quizzes.", color: "bg-amber-500" },
            { icon: <IoDocumentTextOutline />, title: "Practical Projects", desc: "Build real-world portfolios with guided assignments and feedback.", color: "bg-indigo-500" },
            { icon: <IoRibbonOutline />, title: "Professional Certificate", desc: "Earn a downloadable, AI-verified certificate upon 100% completion.", color: "bg-teal-500" }
          ].map((feature, i) => (
            <div key={i} className='glass-effect p-8 rounded-[32px] border-white/20 bg-white/40 dark:bg-black/40 shadow-xl group hover:scale-[1.02] transition-all'>
              <div className={`w-14 h-14 ${feature.color} text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:rotate-6 transition-all`}>
                {feature.icon}
              </div>
              <h3 className='text-xl font-black text-gray-900 dark:text-white mb-3'>{feature.title}</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed'>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Hall of Fame - Social Proof */}
        {graduates?.length > 0 && (
          <div className='glass-effect p-8 rounded-[40px] border-white/20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20'></div>
            <div className='relative z-10'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                <div>
                  <h2 className='text-2xl font-black flex items-center gap-3'>
                    <IoRibbonOutline className='text-amber-400' /> Hall of Fame
                  </h2>
                  <p className='text-indigo-100 font-bold'>Join these successful students who mastered this course</p>
                </div>
                <div className='flex flex-wrap justify-center md:justify-end gap-6'>
                  {graduates.map((grad, i) => (
                    <div key={i} className='group relative flex flex-col items-center gap-2'>
                      <div className='relative'>
                        <img
                          src={grad.photoUrl || img}
                          className='w-16 h-16 rounded-2xl border-4 border-white/20 object-cover shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer'
                          alt={grad.name}
                        />
                        <div className='absolute -top-2 -right-2 bg-amber-400 text-black p-1 rounded-lg shadow-lg rotate-12 group-hover:rotate-0 transition-all'>
                          <IoRibbonOutline size={14} />
                        </div>
                      </div>
                      <div className='text-center'>
                        <p className='text-[10px] font-black uppercase tracking-tighter opacity-80'>{grad.name}</p>
                        <div className='mt-1 w-12 h-8 bg-white/10 rounded border border-white/20 flex items-center justify-center overflow-hidden group-hover:bg-white/20 transition-all'>
                          <div className='w-full h-full p-0.5 bg-white/5 flex flex-col gap-0.5'>
                            <div className='h-0.5 w-1/2 bg-indigo-300 mx-auto'></div>
                            <div className='h-0.5 w-3/4 bg-gray-400 mx-auto'></div>
                            <div className='h-0.5 w-2/3 bg-gray-400 mx-auto'></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Tabs / Info */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

          {/* Main Info Column */}
          <div className='lg:col-span-2 space-y-8'>
            <div className='glass-effect p-8 rounded-[32px] border-white/20 shadow-lg bg-white/40 dark:bg-black/40'>
              <h2 className='text-2xl font-black mb-6 text-gray-900 dark:text-white'>What you'll learn</h2>
              <ul className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300 font-medium'>
                {["Core fundamentals", "Industry best practices", "Hands-on projects", "Real-world scenarios"].map((item, i) => (
                  <li key={i} className='flex items-start gap-2'>
                    <span className='text-indigo-500 mt-1 font-bold'>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='glass-effect p-8 rounded-[32px] border-white/20 shadow-lg bg-white/40 dark:bg-black/40'>
              <h2 className='text-2xl font-black mb-4 text-gray-900 dark:text-white'>Description</h2>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed font-medium'>
                Join us in this comprehensive journey through {selectedCourse?.category}. This course is meticulously crafted to take you from a basic understanding to mastery, with real-world examples and hands-on exercises that reinforce your learning.
              </p>
            </div>

            {/* Review Section */}
            <div className='glass-effect p-8 rounded-[32px] border-white/20 shadow-lg bg-white/40 dark:bg-black/40'>
              <h2 className='text-2xl font-black mb-6 text-gray-900 dark:text-white'>Student Feedback</h2>

              {/* Submit Review Form */}
              <div className='space-y-6 pb-12 border-b border-gray-200 dark:border-white/10'>
                <div className='flex gap-2 mb-4'>
                  {[1, 2, 3, 4, 5].map(num => (
                    <FaStar
                      key={num}
                      onClick={() => setRating(num)}
                      className={`cursor-pointer text-3xl transition-colors drop-shadow-sm ${num <= rating ? "text-yellow-500" : "text-gray-300 dark:text-zinc-700"
                        }`}
                    />
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this course..."
                  className='w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white placeholder-gray-400 font-medium outline-none'
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={loading}
                  className={`bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Submitting..." : "Post Review"}
                </button>
              </div>

              {/* Existing Reviews List */}
              <div className='mt-12 space-y-8'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                  Recent Reviews ({selectedCourse?.reviews?.length || 0})
                </h3>

                {selectedCourse?.reviews?.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {selectedCourse.reviews.slice().reverse().map((review, index) => (
                      <div key={index} className='scale-90 origin-top-left -mb-10'>
                        <CardReview
                          comment={review.comment}
                          rating={review.rating}
                          name={review.user?.name}
                          photoUrl={review.user?.photoUrl}
                          description={review.user?.description}
                          courseTitle={selectedCourse.title}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-10 bg-white/30 dark:bg-white/5 rounded-2xl border border-white/10'>
                    <p className='text-gray-500 dark:text-gray-400 font-medium'>No reviews yet. Be the first to review this course!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div className='space-y-8'>
            <div className='glass-effect p-6 rounded-[32px] border-white/20 shadow-lg sticky top-28 bg-white/40 dark:bg-black/40'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-black text-gray-900 dark:text-white'>Curriculum</h2>
                <span className='px-3 py-1 bg-white/50 dark:bg-white/10 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300'>
                  {selectedCourse?.lectures?.length} Lessons
                </span>
              </div>

              <div className='space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
                {selectedCourse?.lectures?.map((lecture, index) => {
                  const canWatch = isEnrolled || lecture.isPreviewFree
                  const isPlaying = selectedLecture?._id === lecture._id
                  return (
                    <button
                      key={index}
                      onClick={() => canWatch && setSelectedLecture(lecture)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left group
                        ${isPlaying ? "bg-indigo-500/10 border-indigo-500/30" : "bg-transparent border-gray-200/50 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5"}
                        ${canWatch ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm
                        ${isPlaying ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900"}`}>
                        {canWatch ? (isPlaying ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}><FaPlayCircle /></motion.div> : <FaPlayCircle />) : <FaLock />}
                      </div>
                      <div className='flex-1 overflow-hidden'>
                        <p className={`text-sm font-bold truncate ${isPlaying ? "text-indigo-700 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}`}>
                          {lecture?.lectureTitle}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>Lesson {index + 1}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Video Preview Modal-like area */}
              {selectedLecture && (
                <div className='mt-6 pt-6 border-t border-gray-200 dark:border-white/10'>
                  <div className='aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group border border-white/10'>
                    <video
                      className='w-full h-full'
                      src={selectedLecture.videoUrl}
                      controls
                      autoPlay
                    />
                  </div>
                  <p className='mt-3 text-xs text-center text-gray-400 italic font-medium'>Now Playing: {selectedLecture.lectureTitle}</p>
                </div>
              )}
            </div>

            {/* Instructor Info */}
            <div className='bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-600/30 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10'></div>
              <div className='absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10'></div>

              <h2 className='text-sm uppercase tracking-widest font-black mb-6 opacity-60 relative z-10'>Taught By</h2>
              <div className='flex items-center gap-4 mb-6 relative z-10'>
                <img src={creatorData?.photoUrl || img} className='w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg' alt={creatorData?.name} />
                <div>
                  <h3 className='text-xl font-bold'>{creatorData?.name}</h3>
                  <p className='text-indigo-200 text-sm font-medium'>Expert Instructor</p>
                </div>
              </div>
              <p className='text-indigo-100 text-sm leading-relaxed mb-6 italic relative z-10 font-medium'>
                "Passionate about teaching and helping students reach their career goals through practical knowledge."
              </p>
              <button className='w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg relative z-10'>
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* More Courses by Creator */}
        {creatorCourses?.length > 0 && (
          <div className='space-y-8 pt-12 border-t border-gray-200/50 dark:border-white/5'>
            <div>
              <h2 className='text-3xl font-black text-gray-900 dark:text-white'>Recommended for you</h2>
              <p className='text-gray-500 dark:text-gray-400 font-medium'>More courses from the same instructor</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {creatorCourses.map((course, index) => (
                <div key={index} className='glass-effect rounded-[32px] overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white/40 dark:bg-black/40'>
                  <Card
                    thumbnail={course.thumbnail}
                    id={course._id}
                    price={course.price}
                    title={course.title}
                    category={course.category}
                    reviews={course.reviews}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ViewCourse