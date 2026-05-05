import React, { useState } from 'react'
import logo from '../assets/logo.jpg';
import google from '../assets/google.jpg';
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../constants';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';

const SignUp = () => {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSendOTP = async () => {
    if (!name || !email || !password) {
      return toast.error("Please fill all fields");
    }
    setLoading(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/send-signup-otp",
        { email }
      );
      setLoading(false)
      setOtpSent(true)
      toast.success(result.data.message)
    } catch (error) {
      console.log(error)
      setLoading(false)
      const errorMsg = error.response?.data?.message || "Failed to send OTP";

      if (error.response?.data?.exists) {
        toast.info(errorMsg, {
          onClick: () => navigate("/login"),
          autoClose: 6000
        });
      } else {
        toast.error(errorMsg);
      }
    }
  }

  const handleSignup = async () => {
    if (!otp) {
      return toast.error("Please enter OTP");
    }
    setLoading(true)
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, password, email, role, otp },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data.user))
      setLoading(false)
      toast.success("Signup Successfully")
      navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response?.data?.message || "Signup failed")
    }
  }
  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let user = response.user
      let name = user.displayName
      let email = user.email
      const result = await axios.post(serverUrl + "/api/auth/googleauth", { name, email, role }, { withCredentials: true })
      dispatch(setUserData(result.data.user))
      toast.success("Signup Successfully")
      navigate("/")
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Google Signup Failed");

    }
  }


  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-y-auto py-10">
      {/* Background Shapes */}
      <div className='bg-shape bg-indigo-500 w-[400px] h-[400px] top-[-10%] right-[-10%]'></div>
      <div className='bg-shape bg-purple-500 w-[400px] h-[400px] bottom-[-10%] left-[-10%]'></div>

      <form className="glass-effect w-[90%] md:w-[900px] min-h-[620px] rounded-3xl flex relative border-white/20 shadow-2xl overflow-hidden" onSubmit={(e) => e.preventDefault()} >

        {/* Left side (Form Inputs) */}
        <div className='w-full md:w-[55%] flex flex-col items-center justify-center gap-6 p-10 bg-white/50 dark:bg-black/40 backdrop-blur-sm'>

          <div className='text-center space-y-2'>
            <h1 className='font-black text-3xl text-gray-900 dark:text-white'>Create Account</h1>
            <p className='text-gray-500 dark:text-gray-400'>Join our community today</p>
          </div>

          <div className='w-full max-w-sm space-y-4'>
            {/* Show OTP input if OTP is sent, otherwise show Registration fields */}
            {!otpSent ? (
              <>
                {/* Name Field */}
                <div className='flex flex-col gap-2'>
                  <label htmlFor="name" className='text-sm font-bold text-gray-700 dark:text-gray-300'>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>

                {/* Email Field */}
                <div className='flex flex-col gap-2'>
                  <label htmlFor="email" className='text-sm font-bold text-gray-700 dark:text-gray-300'>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="off"
                    className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                {/* Password Field */}
                <div className='flex flex-col gap-2 relative'>
                  <label htmlFor="password" className='text-sm font-bold text-gray-700 dark:text-gray-300'>Password</label>
                  <input
                    type={show ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                    placeholder='Create a password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <div
                    className='absolute right-4 top-[38px] cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors'
                    onClick={() => setShow(prev => !prev)}
                  >
                    {show ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
                  </div>
                </div>

                {/* Student / Educator Role Selection */}
                <div className='flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl'>
                  <button
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "student" ? "bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setRole("student")}
                  >
                    Student
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "educator" ? "bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setRole("educator")}
                  >
                    Educator
                  </button>
                </div>

                <button
                  className='w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2'
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color='white' /> : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div className='flex flex-col gap-2'>
                  <label htmlFor="otp" className='text-sm font-bold text-gray-700 dark:text-gray-300'>Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-center tracking-[10px] text-xl font-black'
                    placeholder='xxxx'
                    maxLength={4}
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                  />
                  <p className='text-xs text-center text-gray-500'>OTP has been sent to {email}</p>
                </div>

                <button
                  className='w-full h-12 bg-indigo-600 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2'
                  onClick={handleSignup}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color='white' /> : "Verify & Create Account"}
                </button>

                <p className='text-center text-sm text-indigo-600 font-bold cursor-pointer hover:underline' onClick={() => setOtpSent(false)}>
                  Change Details / Edit Email
                </p>
              </>
            )}

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-zinc-700"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300 dark:border-zinc-700"></div>
            </div>

            <button
              className='w-full h-12 border border-gray-300 dark:border-zinc-700 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors'
              onClick={googleSignUp}
            >
              <img src={google} className='w-5 h-5' alt="Google" />
              <span className='font-bold text-gray-700 dark:text-gray-200'>Google</span>
            </button>

            <p className='text-center text-gray-500 dark:text-gray-400 text-sm mt-4'>
              Already have an account?
              <span className='text-indigo-600 font-bold cursor-pointer ml-1 hover:underline' onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>
        </div>

        {/* Right Side Logo */}
        <div className='hidden md:flex w-[45%] bg-gradient-to-br from-purple-900 to-black items-center justify-center p-12 relative overflow-hidden'>
          <div className='absolute inset-0 bg-black/20 z-10'></div>
          <img src={logo} alt='logo' className='w-full max-w-[300px] object-contain drop-shadow-2xl relative z-20' />
          <div className='absolute bottom-10 left-10 right-10 z-20 text-white/80 text-center text-sm'>
            <p>"Join thousands of learners and start your journey towards mastery today."</p>
          </div>
          {/* Abstract circles */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl'></div>
        </div>

      </form>
    </div>
  )
}

export default SignUp
