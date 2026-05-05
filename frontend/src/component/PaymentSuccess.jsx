import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../constants';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');
    const sessionId = searchParams.get('session_id');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const finalizeEnrollment = async () => {
            try {
                const response = await axios.post(
                    `${serverUrl}/api/order/enroll-user`,
                    { courseId, sessionId },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    // Refresh user data to update enrollment status
                    const userResult = await axios.get(`${serverUrl}/api/user/getcurrentuser`, { withCredentials: true });
                    dispatch(setUserData(userResult.data));

                    toast.success("Course Unlocked Successfully!");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Enrollment error:", error);
                toast.error("Failed to unlock course. Please contact support.");
                setLoading(false);
            }
        };

        if (courseId) {
            finalizeEnrollment();
        }
    }, [courseId, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20">
            {/* Background Shapes */}
            <div className='bg-shape bg-green-500 w-[500px] h-[500px] top-[-10%] right-[-20%] opacity-30'></div>
            <div className='bg-shape bg-indigo-500 w-[400px] h-[400px] bottom-[-10%] left-[-10%] opacity-30'></div>

            <div className="glass-effect max-w-lg w-full p-8 md:p-12 rounded-[40px] border-white/20 shadow-2xl text-center relative z-10 bg-white/40 dark:bg-black/40">
                {loading ? (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="w-20 h-20 mx-auto">
                            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-500 border-t-transparent"></div>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Processing Your Enrollment...</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Please wait while we unlock your course</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Success Icon with Animation */}
                        <div className="relative">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-bounce">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            {/* Confetti Effect */}
                            <div className="absolute inset-0 -z-10">
                                <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                                <div className="absolute top-4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                                <div className="absolute bottom-4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white">Payment Successful! 🎉</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-md mx-auto">
                                Mubarak ho! Aapne successfully course unlock kar liya hai. Ab aap lectures dekh sakte hain aur apni learning journey shuru kar sakte hain.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => navigate('/mycourses')}
                                className="flex-1 px-6 py-4 border-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                            >
                                My Courses
                            </button>
                            <button
                                onClick={() => navigate(`/viewlecture/${courseId}`)}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Start Learning
                            </button>
                        </div>

                        <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                ✨ Course successfully added to your library
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
