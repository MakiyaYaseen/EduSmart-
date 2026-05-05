import React, { useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../constants';
import axios from 'axios';
import { setLectureData } from '../../redux/lectureSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const EditLecture = () => {
    const { courseId, lectureId } = useParams()
    const { lectureData } = useSelector(state => state.lecture)

    // ✅ FIX 3: Safety check ke liye default object set karein
    const selectedLecture = lectureData.find(lecture => lecture._id === lectureId) || {}

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // ✅ FIX 3: State ko safe tareeke se initialize karein
    const [lectureTitle, setLectureTitle] = useState(selectedLecture.lectureTitle || "")
    const [videoFile, setVideoFile] = useState(null) // File ke liye
    const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture.isPreviewFree || false)

    const [loading, setLoading] = useState(false) // Update button ke liye
    const [loading1, setLoading1] = useState(false) // Remove button ke liye

    // Agar data load nahi hua toh render nahi karein (crash se bachne ke liye)
    if (!selectedLecture._id) return <div>Loading lecture data...</div>;

    // 🔑 FIX 2: FormData ko handler function ke andar move kiya gaya hai
    const handleEditLecture = async () => {
        setLoading(true)

        // ✅ FIX 2: FormData object ko yahan banayein
        const formdata = new FormData()
        formdata.append("lectureTitle", lectureTitle)
        formdata.append("isPreviewFree", isPreviewFree)

        // Ensure backend key (videoUrl) is used
        if (videoFile) {
            formdata.append("videoUrl", videoFile);
        }

        try {
            // ✅ FIX 1: Ab yahan axios.post use karna sahi hai (kyuki backend route badal gaya)
            const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}`, formdata, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            // Redux State Update (Purane lecture ko dhoond kar naye data se replace karein)
            const updatedLectures = lectureData.map(lecture =>
                lecture._id === lectureId ? result.data : lecture
            );
            dispatch(setLectureData(updatedLectures));

            toast.success("Lecture Updated")
            navigate(`/createlecture/${courseId}`)
            setLoading(false)
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || "An unknown error occurred during update")
            setLoading(false)
        }
    }

    const removeLecture = async () => {
        setLoading1(true)
        try {
            const result = await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true })
            setLoading1(false)

            // Redux State Update after deletion:
            const filteredLectures = lectureData.filter(lecture => lecture._id !== lectureId);
            dispatch(setLectureData(filteredLectures));

            toast.success("Lecture Removed")
            navigate(`/createlecture/${courseId}`)
        } catch (error) {
            console.error(error)
            setLoading1(false)
            toast.error(error.response?.data?.message || "An unknown error occurred during removal")
        }
    }

    return (
        <div className='min-h-screen pt-20 pb-10 px-4 md:px-8 relative overflow-hidden flex items-center justify-center'>
            {/* Background Shapes */}
            <div className='bg-shape bg-teal-500 w-[500px] h-[500px] top-[-10%] right-[-20%] opacity-30'></div>
            <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] bottom-[10%] left-[-10%] opacity-30'></div>

            <div className='glass-effect w-full max-w-xl p-8 rounded-3xl border-white/20 shadow-2xl relative z-10'>

                <div className='flex items-center justify-between mb-8'>
                    <div
                        className='w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-black transition-all shadow-sm backdrop-blur-sm'
                        onClick={() => navigate(`/createlecture/${courseId}`)}
                    >
                        <FaArrowLeftLong className='text-gray-700 dark:text-gray-300' />
                    </div>
                    <h2 className='text-2xl font-black text-gray-900 dark:text-white'>Edit Lecture</h2>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                <div className='space-y-6'>
                    {/* Lecture Title Input */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1' htmlFor="lectureTitle">
                            Lecture Title
                        </label>
                        <input
                            type="text"
                            id="lectureTitle"
                            className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white backdrop-blur-sm'
                            required
                            onChange={(e) => setLectureTitle(e.target.value)}
                            value={lectureTitle}
                        />
                    </div>

                    {/* Video Input */}
                    <div className='space-y-2'>
                        <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1' htmlFor="videoFile">
                            Video * (Selected: {videoFile ? videoFile.name : "No new file"})
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                id="videoFile"
                                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50 cursor-pointer border border-gray-300 dark:border-zinc-700 rounded-xl bg-white/50 dark:bg-black/20"
                                accept='video/*'
                                onChange={(e) => setVideoFile(e.target.files[0])}
                            />
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className='flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/30 dark:bg-black/20' >
                        <input
                            type="checkbox"
                            className='w-5 h-5 accent-indigo-600 rounded focus:ring-indigo-500 border-gray-300'
                            id='isFree'
                            checked={isPreviewFree}
                            onChange={() => setIsPreviewFree(prev => !prev)}
                        />
                        <label htmlFor="isFree" className='text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none' >
                            Is this Video FREE for Preview?
                        </label>
                    </div>

                    {loading && <p className='text-sm text-indigo-600 dark:text-indigo-400 font-medium animate-pulse text-center'>Uploading video... Please wait.</p>}

                    {/* Buttons */}
                    <div className='grid grid-cols-2 gap-4 pt-4'>
                        <button
                            className='px-6 py-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center'
                            disabled={loading1}
                            onClick={removeLecture}
                        >
                            {loading1 ? <ClipLoader size={20} color='white' /> : "Remove Lecture"}
                        </button>

                        <button
                            className='px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center'
                            disabled={loading}
                            onClick={handleEditLecture}
                        >
                            {loading ? <ClipLoader size={20} color={loading ? "white" : "black"} /> : "Update Lecture"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditLecture