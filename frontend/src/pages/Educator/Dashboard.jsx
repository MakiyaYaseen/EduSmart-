import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
const Dashboard = () => {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const { creatorCourseData } = useSelector(state => state.course)
    const CourseProgressData = creatorCourseData?.map((course) => ({
        name: course.title?.slice(0, 10) + "...",
        lectures: course.lectures?.length || 0
    })) || [];
    const EnrollData = creatorCourseData?.map((course) => ({
        name: course.title?.slice(0, 10) + "...",
        enrolled: course.enrolledStudent?.length || 0
    })) || [];
    const firstLetter = userData?.name?.slice(0, 1).toUpperCase()
    const totalEarning = creatorCourseData?.reduce((sum, course) => {
        const studentCount = course.enrolledStudent?.length || 0;
        const courseRevenue = course.price ? course.price * studentCount : 0
        return sum + courseRevenue;
    }, 0) || 0
    return (
        <div className='min-h-screen pt-20 pb-10 px-4 md:px-8 relative overflow-hidden'>
            {/* Background Shapes */}
            <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] top-[-20%] left-[-10%] opacity-30'></div>
            <div className='bg-shape bg-pink-500 w-[400px] h-[400px] bottom-[10%] right-[-10%] opacity-30'></div>

            <FaArrowLeftLong
                className='w-6 h-6 absolute top-24 left-6 md:left-10 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors z-20'
                onClick={() => navigate("/")}
            />

            <div className='max-w-7xl mx-auto space-y-10 mt-10'>
                {/* Main Profile / Stats Section */}
                <div className='glass-effect rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-xl border-white/20 relative overflow-hidden'>

                    {/* Decorative gradient overlay */}
                    <div className='absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none'></div>

                    <div className='relative'>
                        {userData?.photoUrl ? (
                            <img
                                src={userData.photoUrl}
                                className='w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-zinc-800 shadow-2xl'
                                alt="Educator"
                            />
                        ) : (
                            <div className='w-32 h-32 rounded-3xl border-4 border-white dark:border-zinc-800 shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white'>
                                {firstLetter}
                            </div>
                        )}
                        <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full'></div>
                    </div>

                    <div className='flex-1 text-center md:text-left space-y-2 z-10'>
                        <span className='px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest rounded-full border border-indigo-500/20'>
                            Educator Dashboard
                        </span>
                        <h1 className='text-3xl md:text-4xl font-black text-gray-900 dark:text-white'>
                            Welcome Back, {userData?.name || "Educator"}
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 text-lg max-w-2xl'>
                            {userData?.description || "Ready to inspire the next generation of learners? Track your progress and manage your courses here."}
                        </p>
                    </div>

                    <div className='flex flex-col gap-4 min-w-[200px] z-10'>
                        <div className='bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-center'>
                            <p className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Total Earnings</p>
                            <h2 className='text-2xl font-black text-gray-900 dark:text-white'>
                                PKR {totalEarning.toLocaleString()}
                            </h2>
                        </div>
                        <button
                            className='w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2'
                            onClick={() => navigate("/courses")}>
                            <span>+ Create New Course</span>
                        </button>
                    </div>
                </div>

                {/* Graphs Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8' >

                    {/* Course Progress Graph */}
                    <div className='glass-effect rounded-3xl p-8 border-white/20 shadow-lg'>
                        <div className='mb-6'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Course Content Overview</h2>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>Number of lectures per course</p>
                        </div>
                        <div className='h-[300px] w-full'>
                            <ResponsiveContainer width="100%" height="100%" >
                                <BarChart data={CourseProgressData} >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="lectures" fill='#4F46E5' radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Enrollment Graph */}
                    <div className='glass-effect rounded-3xl p-8 border-white/20 shadow-lg'>
                        <div className='mb-6'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Student Enrollment Trends</h2>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>Total students enrolled per course</p>
                        </div>
                        <div className='h-[300px] w-full'>
                            <ResponsiveContainer width="100%" height="100%" >
                                <BarChart data={EnrollData} >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="enrolled" fill='#8B5CF6' radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashboard
