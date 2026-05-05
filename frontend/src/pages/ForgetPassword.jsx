import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../constants";

const ForgetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [conPassword, setConPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Step 1 — Send OTP
    const sendOtp = async () => {
        setLoading(true);
        try {
            const result = await axios.post(
                serverUrl + "/api/auth/sendotp",
                { email },
                { withCredentials: true }
            );
            toast.success(result.data.message);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
        }
        setLoading(false);
    };

    // Step 2 — Verify OTP
    const verifyOtp = async () => {
        setLoading(true);
        try {
            const result = await axios.post(
                serverUrl + "/api/auth/verifyotp",
                { email, otp },
                { withCredentials: true }
            );
            toast.success(result.data.message);
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to verify OTP.");
        }
        setLoading(false);
    };

    // Step 3 — Reset Password
    const resetPassword = async () => {
        if (newPassword !== conPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const result = await axios.post(
                serverUrl + "/api/auth/resetpassword",
                { email, password: newPassword },
                { withCredentials: true }
            );
            toast.success(result.data.message);
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password.");
        }
        setLoading(false);
    };

    return (
        <div className='min-h-screen pt-20 pb-10 px-4 flex items-center justify-center relative overflow-hidden'>
            {/* Background Shapes */}
            <div className='bg-shape bg-indigo-500 w-[400px] h-[400px] top-[-10%] right-[-10%] opacity-30'></div>
            <div className='bg-shape bg-purple-500 w-[300px] h-[300px] bottom-[-10%] left-[-10%] opacity-30'></div>

            <div className='glass-effect w-full max-w-md p-8 rounded-3xl border-white/20 shadow-2xl relative z-10'>

                {/* STEP 1 — Send OTP */}
                {step === 1 && (
                    <div className='animate-fadeIn'>
                        <h2 className='text-3xl font-black text-center mb-2 text-gray-900 dark:text-white'>Forgot Password?</h2>
                        <p className='text-center text-gray-500 dark:text-gray-400 mb-8'>Enter your email to receive an OTP</p>

                        <form className='space-y-6' onSubmit={e => e.preventDefault()}>
                            <div className='space-y-2'>
                                <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1'>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white backdrop-blur-sm'
                                    placeholder="name@example.com"
                                />
                            </div>

                            <button
                                className='w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center'
                                disabled={loading}
                                onClick={sendOtp}
                            >
                                {loading ? <ClipLoader size={20} color={loading ? "white" : "black"} /> : "Send OTP"}
                            </button>
                        </form>

                        <div className='text-center mt-6'>
                            <button
                                className='text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline'
                                onClick={() => navigate("/login")}
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2 — Verify OTP */}
                {step === 2 && (
                    <div className='animate-fadeIn'>
                        <h2 className='text-3xl font-black text-center mb-2 text-gray-900 dark:text-white'>Verify OTP</h2>
                        <p className='text-center text-gray-500 dark:text-gray-400 mb-8'>Enter the 4-digit code sent to your email</p>

                        <form className='space-y-6' onSubmit={(e) => e.preventDefault()}>
                            <div className='space-y-2'>
                                <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1'>One-Time Password</label>
                                <input
                                    type="text"
                                    placeholder="* * * *"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white backdrop-blur-sm text-center tracking-widest text-lg font-bold'
                                    required
                                />
                            </div>

                            <button
                                className='w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center'
                                disabled={loading}
                                onClick={verifyOtp}
                            >
                                {loading ? <ClipLoader size={20} color={loading ? "white" : "black"} /> : "Verify OTP"}
                            </button>
                        </form>
                        <div className='text-center mt-6'>
                            <button
                                className='text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                onClick={() => setStep(1)}
                            >
                                Resend Code?
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3 — Reset Password */}
                {step === 3 && (
                    <div className='animate-fadeIn'>
                        <h2 className='text-3xl font-black text-center mb-2 text-gray-900 dark:text-white'>Reset Password</h2>
                        <p className='text-center text-gray-500 dark:text-gray-400 mb-8'>Create a strong new password</p>

                        <form className='space-y-6' onSubmit={e => e.preventDefault()}>
                            <div className='space-y-2'>
                                <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1'>New Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white backdrop-blur-sm'
                                    required
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1'>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={conPassword}
                                    onChange={e => setConPassword(e.target.value)}
                                    className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white backdrop-blur-sm'
                                    required
                                />
                            </div>

                            <button
                                className='w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center'
                                disabled={loading}
                                onClick={resetPassword}
                            >
                                {loading ? <ClipLoader size={20} color={loading ? "white" : "black"} /> : "Reset Password"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
