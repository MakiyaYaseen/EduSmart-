import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";

const Profile = () => {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()

  if (!userData) {
    return (
      <div className='min-h-screen flex justify-center items-center text-xl'>
        Loading...
      </div>
    )
  }

  return (
    <div className='min-h-screen pt-20 pb-10 px-4 flex items-center justify-center relative overflow-hidden'>
      {/* Background Shapes */}
      <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] top-[-10%] right-[-20%] opacity-30'></div>
      <div className='bg-shape bg-purple-500 w-[500px] h-[500px] bottom-[10%] left-[-10%] opacity-30'></div>

      <div className='glass-effect max-w-xl w-full p-8 md:p-12 rounded-[40px] border-white/20 shadow-2xl relative z-10 text-center'>

        <div
          className='absolute top-8 left-8 w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-black transition-all shadow-sm backdrop-blur-sm'
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong className='text-gray-700 dark:text-gray-300' />
        </div>

        <div className='flex flex-col items-center mb-8'>
          <div className='relative mb-6 group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200'></div>
            {userData.photoUrl ? (
              <img
                src={userData.photoUrl}
                className='relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-black shadow-xl ring-2 ring-indigo-500/50'
                alt={userData.name}
              />
            ) : (
              <div className='relative w-32 h-32 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-4xl font-black border-4 border-white dark:border-zinc-900 shadow-xl ring-2 ring-indigo-500/50'>
                {userData?.name?.slice(0, 1)?.toUpperCase()}
              </div>
            )}
          </div>

          <h2 className='text-3xl font-black text-gray-900 dark:text-white mb-2'>{userData.name}</h2>
          <span className='px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-full text-sm uppercase tracking-wider border border-indigo-200 dark:border-indigo-800'>
            {userData.role}
          </span>
        </div>

        <div className='space-y-6 text-left bg-white/40 dark:bg-black/20 p-8 rounded-3xl border border-white/20 dark:border-white/5'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs font-black text-gray-400 uppercase tracking-widest'>Email Address</span>
            <span className='text-gray-900 dark:text-white font-medium truncat text-lg'>{userData.email}</span>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-xs font-black text-gray-400 uppercase tracking-widest'>About Me</span>
            <p className='text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic'>
              {userData.description ? `"${userData.description}"` : <span className="text-gray-400 not-italic">No bio added yet.</span>}
            </p>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-xs font-black text-gray-400 uppercase tracking-widest'>My Learning Journey</span>
            <div className='flex items-center gap-3 mt-2'>
              <div className='flex -space-x-3'>
                {[1, 2, 3].map(i => (
                  <div key={i} className='w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 border-2 border-white dark:border-black'></div>
                ))}
              </div>
              <span className='font-bold text-gray-900 dark:text-white'>{userData.enrolledCourses?.length || 0} enrolled courses</span>
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <button
            className='w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2'
            onClick={() => navigate("/editprofile")}
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile
