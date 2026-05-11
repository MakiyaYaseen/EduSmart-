import React, { useEffect, useState } from 'react'
// import about from '../assets/about.jpg'
// import video from "../assets/video.mp4"
const about = "/about.jpg";
const video = "/video.mp4";
import { BsFillPatchCheckFill, BsArrowRight } from 'react-icons/bs'
import { motion } from 'framer-motion'
import axios from 'axios'
import { serverUrl } from '../constants'
import { useNavigate } from 'react-router-dom'

function About() {
  const [studentCount, setStudentCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/stats`)
        setStudentCount(response.data.studentCount)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    fetchStats()
  }, [])

  const features = [
    "Personalized AI Learning Paths",
    "Expert-Led Video Masterclasses",
    "Industry-Recognized Certificates",
    "Hands-on Real World Projects"
  ];

  return (
    <div id='about' className='w-full py-24 bg-white/30 dark:bg-black/20 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex flex-col lg:flex-row items-center gap-16'>

          {/* LEFT: Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='w-full lg:w-1/2'
          >
            <div className='relative'>
              {/* Main Image with modern styling */}
              <div className='relative rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900'>
                <img
                  src={about}
                  alt="Students Learning"
                  className='w-full h-[400px] md:h-[500px] object-cover opacity-90'
                />

                {/* Floating Video Card */}
                <div className='absolute bottom-6 left-6 right-6 md:right-auto md:w-80 glass-effect p-3 rounded-2xl border-white/40 shadow-2xl animate-fadeIn'>
                  <div className='relative rounded-xl overflow-hidden aspect-video border border-white/20'>
                    <video
                      src={video}
                      autoPlay loop muted playsInline
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-black/20'></div>
                  </div>
                  <div className='mt-3 flex items-center justify-between px-2'>
                    <span className='text-xs font-bold text-gray-800 dark:text-gray-100'>Live Sessions Included</span>
                    <span className='w-2 h-2 rounded-full bg-red-500 animate-pulse'></span>
                  </div>
                </div>
              </div>

              {/* Stats Badge - Clean & Professional */}
              <div className='absolute -top-6 -right-6 glass-effect p-6 rounded-[2rem] border-white/40 shadow-2xl hidden md:block'>
                <div className='text-center'>
                  <p className='text-3xl font-black text-indigo-600 dark:text-indigo-400'>{studentCount}+</p>
                  <p className='text-[10px] uppercase tracking-widest font-black text-gray-500 dark:text-gray-400 mt-1'>Verified Learners</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='w-full lg:w-1/2 space-y-8'
          >
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='h-[2px] w-8 bg-indigo-600'></div>
                <span className='text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest'>Our Mission</span>
              </div>
              <h2 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight'>
                Transforming the Way <br />
                <span className='text-indigo-600'>The World Learns.</span>
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-xl'>
                We've built a platform that combines the power of AI with human-centric teaching. Our goal is to make high-quality education accessible, interactive, and job-ready for everyone, everywhere.
              </p>
            </div>

            {/* Feature List */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8'>
              {features.map((feature, i) => (
                <div key={i} className='flex items-center gap-3 group'>
                  <div className='w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform'>
                    <BsFillPatchCheckFill className='w-4 h-4' />
                  </div>
                  <span className='text-sm font-bold text-gray-700 dark:text-gray-300'>{feature}</span>
                </div>
              ))}
            </div>

            <div className='pt-6 flex flex-wrap gap-4'>
              <button
                onClick={() => navigate('/allcourses')}
                className='px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-4'
              >
                Explore Courses <BsArrowRight className='w-5 h-5' />
              </button>

              <div className='flex items-center gap-4 px-6 border-l-2 border-gray-100 dark:border-zinc-800'>
                <div className='flex -space-x-3'>
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className='w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900' alt="student" />
                  ))}
                </div>
                <div>
                  <p className='text-xs font-black text-gray-900 dark:text-white'>Trusted by {studentCount}+</p>
                  <p className='text-[10px] font-bold text-gray-500'>Global Students</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default About