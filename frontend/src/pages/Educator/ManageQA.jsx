import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../constants";
import DiscussionBoard from "../../component/DiscussionBoard";

const ManageQA = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true });
                setCourse(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        if (courseId) fetchCourse();
    }, [courseId]);

    return (
        <div className='min-h-screen pt-20 pb-10 px-4 md:px-8 relative overflow-hidden'>
            <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] top-[-10%] right-[-20%] opacity-30'></div>
            <div className='bg-shape bg-purple-500 w-[500px] h-[500px] bottom-[10%] left-[-10%] opacity-30'></div>

            <div className='max-w-5xl mx-auto relative z-10 flex flex-col gap-6'>
                <div className='glass-effect p-6 rounded-[32px] border-white/20 shadow-xl bg-white/40 dark:bg-black/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                    <div className='flex items-center gap-6'>
                        <div onClick={() => navigate(`/editcourse/${courseId}`)} className='w-12 h-12 rounded-full bg-white/50 dark:bg-black/50 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all'>
                            <FaArrowLeftLong size={20} className='text-gray-900 dark:text-gray-300' />
                        </div>
                        <div>
                            <h2 className='text-2xl md:text-3xl font-black text-gray-900 dark:text-white'>Course Q&A</h2>
                            <p className='text-sm font-bold text-gray-500 line-clamp-1'>Manage all student questions for: <span className="text-indigo-600">{course?.title || "Loading..."}</span></p>
                        </div>
                    </div>
                </div>

                <div className=''>
                    <DiscussionBoard courseId={courseId} />
                </div>
            </div>
        </div>
    );
};

export default ManageQA;
