import React, { useState } from 'react'
import logo from '../assets/logo.jpg';
import google from '../assets/google.jpg';
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { serverUrl } from '../constants';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';
import { FaArrowLeftLong } from 'react-icons/fa6'

const Login = () => {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = async () => {
    setLoading(true)

    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data.user))
      setLoading(false)
      toast.success("Login Successfully")
      navigate("/")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }
  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let user = response.user
      let name = user.displayName
      let email = user.email
      let role = ""
      const result = await axios.post(serverUrl + "/api/auth/googleauth", { name, email, role }, { withCredentials: true })
      dispatch(setUserData(result.data.user))
      toast.success("Login Successfully")
      navigate("/")
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Google Signup Failed");

    }
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-y-auto py-10">
      {/* Background Shapes for this page specifically if needed, or rely on global */}
      <div className='bg-shape bg-indigo-500 w-[400px] h-[400px] top-[-10%] right-[-10%]'></div>
      <div className='bg-shape bg-purple-500 w-[400px] h-[400px] bottom-[-10%] left-[-10%]'></div>

      <form
        className="glass-effect w-[90%] md:w-[900px] min-h-[600px] rounded-3xl flex relative border-white/20 shadow-2xl overflow-hidden"
        onSubmit={(e) => e.preventDefault() } >

        <FaArrowLeftLong
          className='absolute top-6 left-6 w-6 h-6 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors z-20'
          onClick={() => navigate('/')}
        />

        {/* Left side */}
        <div className='w-full md:w-[55%] flex flex-col items-center justify-center gap-6 p-10 bg-white/50 dark:bg-black/40 backdrop-blur-sm'>

          <div className='text-center space-y-2'>
            <h1 className='font-black text-3xl text-gray-900 dark:text-white'>Welcome Back</h1>
            <p className='text-gray-500 dark:text-gray-400'>Login to continue your journey</p>
          </div>

          <div className='w-full max-w-sm space-y-4'>
            {/* Email */}
            <div className='flex flex-col gap-2'>
              <label htmlFor="email" className='text-sm font-bold text-gray-700 dark:text-gray-300'>Email Address</label>
              <input
                type="email"
                id="email"
                autoComplete="off"
                className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                placeholder='name@example.com'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            {/* Password */}
            <div className='flex flex-col gap-2 relative'>
              <label htmlFor="password" className='text-sm font-bold text-gray-700 dark:text-gray-300'>Password</label>
              <input
                type={show ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                placeholder='Enter your password'
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

            <div className='flex justify-end'>
              <span className='text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer' onClick={() => navigate("/forget")}>
                Forgot Password?
              </span>
            </div>

            <button
              className='w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2'
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Login"}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-zinc-700"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300 dark:border-zinc-700"></div>
            </div>

            <button
              className='w-full h-12 border border-gray-300 dark:border-zinc-700 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors'
              onClick={googleLogin}
            >
              <img src={google} className='w-5 h-5' alt="Google" />
              <span className='font-bold text-gray-700 dark:text-gray-200'>Google</span>
            </button>

            <p className='text-center text-gray-500 dark:text-gray-400 text-sm mt-4'>
              Don't have an account?
              <span
                className='text-indigo-600 font-bold cursor-pointer ml-1 hover:underline'
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>

        {/* Right Side (Image/Branding) */}
        <div className='hidden md:flex w-[45%] bg-gradient-to-br from-indigo-900 to-black items-center justify-center p-12 relative overflow-hidden'>
          <div className='absolute inset-0 bg-black/20 z-10'></div>
          <img src={logo} alt='logo' className='w-full max-w-[300px] object-contain drop-shadow-2xl relative z-20' />
          <div className='absolute bottom-10 left-10 right-10 z-20 text-white/80 text-center text-sm'>
            <p>"Unlock your potential with EduSmart. The future of education is here."</p>
          </div>
          {/* Abstract circles */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl'></div>
        </div>

      </form>
    </div>
  )
}

export default Login
