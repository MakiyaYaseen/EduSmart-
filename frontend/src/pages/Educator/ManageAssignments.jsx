import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../../constants'
import { FaArrowLeftLong } from "react-icons/fa6"
import { IoAddCircleOutline, IoDocumentTextOutline, IoPeopleOutline, IoCheckmarkCircleOutline } from "react-icons/io5"
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

const ManageAssignments = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [submissions, setSubmissions] = useState([])
    const [loadingSubmissions, setLoadingSubmissions] = useState(false)

    // New Assignment State
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        deadline: ""
    })

    // Grading State (Object indexed by submission ID to support multiple submissions)
    const [gradingData, setGradingData] = useState({})
    const [viewedSubmissions, setViewedSubmissions] = useState(new Set())


    const fetchAssignments = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/assignment/course/${courseId}`, { withCredentials: true })
            setAssignments(res.data)
        } catch (error) {
            toast.error("Failed to fetch assignments")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAssignments()
    }, [courseId])

    const handleCreateAssignment = async () => {
        if (!newAssignment.title || !newAssignment.description || !newAssignment.deadline) {
            return toast.error("Please fill all fields")
        }
        try {
            await axios.post(`${serverUrl}/api/assignment/create`, {
                ...newAssignment,
                courseId
            }, { withCredentials: true })
            toast.success("Assignment created successfully!")
            setShowCreateModal(false)
            setNewAssignment({ title: "", description: "", deadline: "" })
            fetchAssignments()
        } catch (error) {
            toast.error("Failed to create assignment")
        }
    }

    const fetchSubmissions = async (assignmentId) => {
        setLoadingSubmissions(true)
        try {
            const res = await axios.get(`${serverUrl}/api/assignment/submissions/${assignmentId}`, { withCredentials: true })
            setSubmissions(res.data)
            setShowSubmissionsModal(true)
        } catch (error) {
            toast.error("Failed to fetch submissions")
        } finally {
            setLoadingSubmissions(false)
        }
    }

    const handleGradeSubmission = async (subId) => {
        console.log("Attempting to grade:", subId, "Data:", gradingData[subId]);
        
        if (!viewedSubmissions.has(subId)) {
            return toast.warn("Please view the assignment PDF before grading!")
        }
        
        const currentGrading = gradingData[subId] || {}
        if (!currentGrading.score) return toast.error("Please provide marks")
        if (Number(currentGrading.score) > 30 || Number(currentGrading.score) < 0) return toast.error("Marks must be between 0 and 30")

        try {
            await axios.put(`${serverUrl}/api/assignment/grade/${subId}`, {
                grade: `${currentGrading.score}/30`,
                score: Number(currentGrading.score),
                feedback: currentGrading.feedback || ""
            }, { withCredentials: true })
            
            toast.success("Submission graded!")
            // Clear grading for this specific submission
            setGradingData(prev => {
                const newData = { ...prev }
                delete newData[subId]
                return newData
            })
            fetchSubmissions(selectedAssignment._id)
        } catch (error) {
            console.error("Grading error:", error)
            const errorMsg = error.response?.data?.message || "Failed to grade submission"
            toast.error(errorMsg)
        }
    }

    const openSubmissionFile = (subId, originalUrl) => {
        // Mark as viewed for grading
        setViewedSubmissions(prev => new Set([...prev, subId]));

        // Direct approach: Open the proxy URL in a new window.
        // This is often more reliable than fetch(blob) because it allows the browser to handle the stream naturally.
        const proxyUrl = `${serverUrl}/api/assignment/view-file/${subId}`;
        
        // We open it in a new tab. Since it's a direct browser request, 
        // the browser will naturally send the session cookies.
        window.open(proxyUrl, '_blank');
        
        toast.info("Opening secure viewer...");
    };

    return (
        <div className='min-h-screen pt-24 pb-12 px-4 md:px-8 relative overflow-hidden'>
            <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] top-[-10%] right-[-10%] opacity-20'></div>
            <div className='bg-shape bg-purple-500 w-[400px] h-[400px] bottom-[10%] left-[-5%] opacity-20'></div>

            <div className='max-w-6xl mx-auto space-y-8 relative z-10'>
                {/* Header */}
                <div className='flex items-center justify-between gap-6'>
                    <div className='flex items-center gap-4'>
                        <div onClick={() => navigate(`/editcourse/${courseId}`)} className='w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-all'>
                            <FaArrowLeftLong />
                        </div>
                        <h1 className='text-3xl font-black text-gray-900 dark:text-white'>Manage Assignments</h1>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className='px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20'
                    >
                        <IoAddCircleOutline size={20} /> Create Assignment
                    </button>
                </div>

                {loading ? (
                    <div className='flex justify-center py-20'>
                        <ClipLoader color="#4f46e5" size={40} />
                    </div>
                ) : assignments.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {assignments.map((assignment) => (
                            <div key={assignment._id} className='glass-effect p-6 rounded-[32px] border-white/20 bg-white/40 dark:bg-black/40 shadow-xl flex flex-col gap-4'>
                                <div>
                                    <h3 className='text-xl font-black text-gray-900 dark:text-white line-clamp-1'>{assignment.title}</h3>
                                    <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1'>{assignment.description}</p>
                                </div>
                                <div className='flex items-center gap-4 py-3 border-y border-gray-100 dark:border-white/5'>
                                    <div className='flex-1'>
                                        <p className='text-[10px] font-black uppercase text-gray-400 tracking-widest'>Deadline</p>
                                        <p className='text-xs font-bold dark:text-white'>{new Date(assignment.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedAssignment(assignment)
                                            fetchSubmissions(assignment._id)
                                        }}
                                        className='flex items-center gap-2 text-indigo-600 font-bold text-xs hover:underline'
                                    >
                                        <IoPeopleOutline size={16} /> Submissions
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-20 glass-effect rounded-[40px] border-2 border-dashed border-gray-200 dark:border-white/10'>
                        <IoDocumentTextOutline size={64} className='mx-auto text-gray-300 mb-4' />
                        <h2 className='text-xl font-bold text-gray-400'>No Assignments Created Yet</h2>
                        <p className='text-sm text-gray-500 mt-2'>Click the button above to create your first assignment.</p>
                    </div>
                )}
            </div>

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className='fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4'>
                    <div className='bg-white dark:bg-zinc-950 w-full max-w-lg rounded-[40px] p-8 shadow-2xl border border-white/20'>
                        <h2 className='text-2xl font-black mb-6 dark:text-white'>New Assignment</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='text-sm font-bold ml-1 dark:text-white'>Assignment Title</label>
                                <input
                                    type="text"
                                    className='w-full h-12 px-4 mt-1 rounded-2xl bg-gray-50 dark:bg-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent'
                                    placeholder="e.g. Design a Landing Page"
                                    value={newAssignment.title}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className='text-sm font-bold ml-1 dark:text-white'>Description</label>
                                <textarea
                                    className='w-full h-32 p-4 mt-1 rounded-2xl bg-gray-50 dark:bg-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent resize-none'
                                    placeholder="Brief task details..."
                                    value={newAssignment.description}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className='text-sm font-bold ml-1 dark:text-white'>Deadline Date</label>
                                <input
                                    type="date"
                                    className='w-full h-12 px-4 mt-1 rounded-2xl bg-gray-50 dark:bg-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent'
                                    value={newAssignment.deadline}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className='flex gap-3 mt-8'>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className='flex-1 py-4 rounded-3xl font-bold text-gray-500 hover:bg-gray-100 transition-all'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAssignment}
                                className='flex-1 py-4 bg-indigo-600 text-white rounded-3xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all'
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submissions Modal */}
            {showSubmissionsModal && (
                <div className='fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4'>
                    <div className='bg-white dark:bg-zinc-950 w-full max-w-4xl max-h-[85vh] rounded-[40px] p-8 shadow-2xl border border-white/20 overflow-hidden flex flex-col'>
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className='text-2xl font-black dark:text-white'>Submissions: {selectedAssignment?.title}</h2>
                            <button onClick={() => setShowSubmissionsModal(false)} className='text-gray-400 hover:text-red-500 text-xl font-bold'>✕</button>
                        </div>

                        <div className='flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2'>
                            {submissions.length > 0 ? submissions.map((sub) => (
                                <div key={sub._id} className='p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-indigo-500/20 transition-all'>
                                    <div className='flex flex-col md:flex-row justify-between gap-6'>
                                        <div className='flex-1 space-y-2'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase'>
                                                    {sub.student?.name?.charAt(0)}
                                                </div>
                                                <span className='font-bold dark:text-white'>{sub.student?.name}</span>
                                            </div>
                                            <p className='text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-black/20 p-4 rounded-2xl'>{sub.content}</p>
                                              {sub.fileUrl && (
                                                <button
                                                    onClick={() => openSubmissionFile(sub._id, sub.fileUrl)}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewedSubmissions.has(sub._id) ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                                >
                                                    <IoDocumentTextOutline /> {viewedSubmissions.has(sub._id) ? "Viewed (Ready to Grade)" : "View Submitted PDF"}
                                                </button>
                                            )}
                                        </div>

                                        <div className='w-full md:w-64 space-y-3'>
                                            <div className='p-4 rounded-2xl bg-white dark:bg-black/20 space-y-3'>
                                                <div>
                                                    <label className='text-[10px] font-black uppercase text-gray-400'>Marks (Out of 30%)</label>
                                                    <input
                                                        type="number"
                                                        placeholder={sub.score ? `${sub.score}` : "e.g. 25"}
                                                        className='w-full h-10 px-3 bg-gray-50 dark:bg-zinc-800 rounded-xl mt-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white'
                                                        value={gradingData[sub._id]?.score || ""}
                                                        onChange={(e) => setGradingData({ 
                                                            ...gradingData, 
                                                            [sub._id]: { ...gradingData[sub._id], score: e.target.value } 
                                                        })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className='text-[10px] font-black uppercase text-gray-400'>Feedback (Shown on cert)</label>
                                                    <textarea
                                                        placeholder={sub.feedback || "Good attempt..."}
                                                        className='w-full h-20 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl mt-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white resize-none'
                                                        value={gradingData[sub._id]?.feedback || ""}
                                                        onChange={(e) => setGradingData({ 
                                                            ...gradingData, 
                                                            [sub._id]: { ...gradingData[sub._id], feedback: e.target.value } 
                                                        })}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleGradeSubmission(sub._id)}
                                                    className='w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors'
                                                >
                                                    Save Grade
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className='py-20 text-center opacity-50'>
                                    <IoPeopleOutline size={48} className='mx-auto mb-2' />
                                    <p className='font-bold'>No submissions from students yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageAssignments
