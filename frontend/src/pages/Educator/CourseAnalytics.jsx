import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../../constants'
import { FaArrowLeftLong } from "react-icons/fa6"
import { IoRibbonOutline, IoCheckmarkCircle, IoTimeOutline, IoAnalyticsOutline, IoPeopleOutline } from "react-icons/io5"
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

const CourseAnalytics = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        issuedCertificates: 0,
        averageProgress: 0,
        totalStudents: 0
    })

    const fetchAnalytics = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/course/analytics/${courseId}`, { withCredentials: true })
            setStudents(res.data.students)
            setStats(res.data.stats)
        } catch (error) {
            toast.error("Failed to fetch analytics")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [courseId])

    return (
        <div className='min-h-screen pt-24 pb-12 px-4 md:px-8 relative overflow-hidden'>
            <div className='bg-shape bg-teal-500 w-[500px] h-[500px] top-[-10%] left-[-10%] opacity-20'></div>
            <div className='bg-shape bg-indigo-500 w-[400px] h-[400px] bottom-[10%] right-[-5%] opacity-20'></div>

            <div className='max-w-6xl mx-auto space-y-8 relative z-10'>
                {/* Header */}
                <div className='flex items-center gap-4'>
                    <div onClick={() => navigate(`/editcourse/${courseId}`)} className='w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-all'>
                        <FaArrowLeftLong />
                    </div>
                    <div>
                        <h1 className='text-3xl font-black text-gray-900 dark:text-white'>Student Progress & Certificates</h1>
                        <p className='text-sm text-gray-500 font-bold'>Overview of your students' achievements</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='glass-effect p-6 rounded-[32px] bg-white/40 dark:bg-black/40 border-white/20 shadow-xl'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg'>
                                <IoRibbonOutline size={26} />
                            </div>
                            <div>
                                <p className='text-[10px] font-black uppercase text-gray-400'>Certificates Issued</p>
                                <h2 className='text-2xl font-black dark:text-white'>{stats.issuedCertificates}</h2>
                            </div>
                        </div>
                    </div>
                    <div className='glass-effect p-6 rounded-[32px] bg-white/40 dark:bg-black/40 border-white/20 shadow-xl'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg'>
                                <IoAnalyticsOutline size={26} />
                            </div>
                            <div>
                                <p className='text-[10px] font-black uppercase text-gray-400'>Average Progress</p>
                                <h2 className='text-2xl font-black dark:text-white'>{stats.averageProgress}%</h2>
                            </div>
                        </div>
                    </div>
                    <div className='glass-effect p-6 rounded-[32px] bg-white/40 dark:bg-black/40 border-white/20 shadow-xl'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg'>
                                <IoPeopleOutline size={26} />
                            </div>
                            <div>
                                <p className='text-[10px] font-black uppercase text-gray-400'>Total Students</p>
                                <h2 className='text-2xl font-black dark:text-white'>{stats.totalStudents}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className='glass-effect rounded-[40px] border-white/20 shadow-2xl bg-white/50 dark:bg-black/40 overflow-hidden'>
                    <div className='p-8 border-b dark:border-white/5 flex justify-between items-center'>
                        <h2 className='text-xl font-black dark:text-white'>Enrolled Students</h2>
                        <span className='px-4 py-1.5 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-bold uppercase'>Real-time tracking</span>
                    </div>

                    {loading ? (
                        <div className='flex justify-center py-20'>
                            <ClipLoader color="#4f46e5" size={40} />
                        </div>
                    ) : students.length > 0 ? (
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left'>
                                <thead className='bg-gray-50/50 dark:bg-white/5'>
                                    <tr>
                                        <th className='px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest'>Student</th>
                                        <th className='px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center'>Video %</th>
                                        <th className='px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center'>Quiz %</th>
                                        <th className='px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center'>Assignments %</th>
                                        <th className='px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center'>Final Grade</th>
                                        <th className='px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest'>Certificate</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y dark:divide-white/5'>
                                    {students.map((student) => (
                                        <tr key={student._id} className='hover:bg-white/30 dark:hover:bg-white/5 transition-colors'>
                                            <td className='px-8 py-6'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm'>
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className='font-bold dark:text-white'>{student.name}</p>
                                                        <p className='text-xs text-gray-500'>{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-8 py-6 text-center font-bold text-sm text-indigo-500'>
                                                {student.videoProgress}%
                                            </td>
                                            <td className='px-8 py-6 text-center font-bold text-sm text-teal-500'>
                                                {student.quizScore}%
                                            </td>
                                            <td className='px-8 py-6 text-center font-bold text-sm text-purple-500'>
                                                {student.assignmentScore}%
                                            </td>
                                            <td className='px-8 py-6 text-center'>
                                                <span className='px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-black shadow-lg shadow-indigo-600/20'>
                                                    {student.finalGrade}%
                                                </span>
                                            </td>
                                            <td className='px-8 py-6'>
                                                {student.certificateIssued ? (
                                                    <div className='flex items-center gap-2 text-amber-500 font-bold text-xs'>
                                                        <IoRibbonOutline size={18} />
                                                        <span>Issued</span>
                                                    </div>
                                                ) : student.finalGrade > 0 ? (
                                                    <span className='px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider'>In Progress</span>
                                                ) : (
                                                    <span className='text-xs text-gray-400 font-medium'>No Interaction</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='py-20 text-center opacity-30'>
                            <p className='font-black'>NO STUDENTS ENROLLED YET</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseAnalytics
