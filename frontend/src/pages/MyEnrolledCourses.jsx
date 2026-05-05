import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from 'react-icons/fa6'
import axios from 'axios'
import { serverUrl } from '../constants'
import { toast } from 'react-toastify'

const MyEnrolledCourses = () => {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [progressData, setProgressData] = useState({})

    // Redirect educators who try to access student page
    useEffect(() => {
        if (userData?.role === "educator") {
            toast.info("Educators use the Instructor Dashboard instead of the enrolled courses page.");
            navigate("/");
        }
    }, [userData, navigate]);

    useEffect(() => {
        const fetchAllProgress = async () => {
            if (!userData?.enrolledCourses || userData.enrolledCourses.length === 0) return

            const progressMap = {}
            for (const course of userData.enrolledCourses) {
                try {
                    const courseId = course._id || course
                    const result = await axios.get(`${serverUrl}/api/progress/course/${courseId}`, { withCredentials: true })
                    progressMap[courseId] = result.data
                } catch (error) {
                    console.log("Error fetching progress:", error)
                }
            }
            setProgressData(progressMap)
        }

        fetchAllProgress()
    }, [userData?.enrolledCourses])

    const getProgress = (courseId) => {
        return progressData[courseId]?.progressPercentage || 0
    }

    return (
        <div className='min-h-screen w-full px-4 py-20 relative overflow-hidden'>
            {/* Background Shapes */}
            <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] top-[-10%] right-[-20%] opacity-30'></div>
            <div className='bg-shape bg-teal-500 w-[400px] h-[400px] bottom-[-10%] left-[-10%] opacity-30'></div>

            {/* Back Button */}
            <FaArrowLeftLong
                className='absolute top-8 left-8 w-6 h-6 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors z-20'
                onClick={() => navigate('/')}
            />

            <div className="max-w-7xl mx-auto">
                <div className='text-center mb-16 space-y-4'>
                    <span className='px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest rounded-full border border-indigo-500/20'>
                        Learning Journey
                    </span>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white'>
                        My Enrolled Courses
                    </h1>
                    <p className='text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto'>
                        Pick up where you left off. Your progress is saved automatically.
                    </p>
                </div>

                {!userData?.enrolledCourses || userData?.enrolledCourses?.length === 0 ? (
                    <div className='glass-effect rounded-3xl p-16 text-center border-white/20 shadow-lg flex flex-col items-center gap-6'>
                        <div className='w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-4xl'>📚</div>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>No Enrollments Yet</h2>
                        <p className='text-gray-500 dark:text-gray-400 max-w-md'>
                            You haven't enrolled in any courses yet. Explore our catalog to start learning new skills today.
                        </p>
                        <button
                            className='px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-transform'
                            onClick={() => navigate('/allcourses')}
                        >
                            Explore Courses
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {userData?.enrolledCourses?.map((course, index) => (
                            <div
                                key={index}
                                className='glass-effect rounded-[32px] overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full bg-white/40 dark:bg-black/40 backdrop-blur-md'>

                                <div className='relative h-48 w-full overflow-hidden'>
                                    <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10'></div>
                                    <img
                                        src={course?.thumbnail}
                                        alt={course?.title}
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                    />
                                    <div className='absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-20 shadow-sm'>
                                        {course?.category}
                                    </div>
                                </div>

                                <div className='p-6 flex flex-col flex-grow relative'>
                                    <h2 className='text-lg font-black text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2 min-h-[50px]'>
                                        {course?.title}
                                    </h2>

                                    <div className='flex items-center gap-2 mb-2'>
                                        <div className='h-1 w-full bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden'>
                                            <div
                                                className='h-full bg-indigo-500 transition-all duration-500'
                                                style={{ width: `${getProgress(course._id)}%` }}
                                            ></div>
                                        </div>
                                        <span className='text-xs font-black text-gray-500'>{getProgress(course._id)}%</span>
                                    </div>

                                    {progressData[course._id]?.finalScore !== undefined && (
                                        <div className='flex items-center justify-between mb-4'>
                                            <span className='text-[10px] font-black uppercase text-gray-400'>Final Grade</span>
                                            <span className='text-sm font-black text-indigo-600'>{progressData[course._id]?.finalScore}%</span>
                                        </div>
                                    )}

                                    <div className='mt-auto pt-4 border-t border-gray-100 dark:border-white/5'>
                                        <button
                                            className='w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2'
                                            onClick={() => navigate(`/viewlecture/${course._id}`)}
                                        >
                                            <span>Continue Learning</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyEnrolledCourses