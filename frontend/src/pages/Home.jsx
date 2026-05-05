import React, { useState, useEffect } from 'react'
import Nav from '../component/Nav'
import home from "../assets/home1.jpg"
import { SiViaplay } from "react-icons/si";
import { FaStar } from "react-icons/fa";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import Logos from '../component/Logos';
import ExploreCourses from '../component/ExploreCourses';
import CardPage from '../component/CardPage';
import { useNavigate } from 'react-router-dom';
import About from '../component/About';
import Footer from '../component/Footer';
import ReviewPage from '../component/ReviewPage';
import FeaturesSection from '../component/FeaturesSection';
import { motion } from 'framer-motion';
import axios from 'axios';
import { serverUrl } from '../constants';

const Home = () => {
  const navigate = useNavigate()
  const [studentCount, setStudentCount] = useState(0)
  const [certificateCount, setCertificateCount] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/stats`)
        setStudentCount(response.data.studentCount)
        setCertificateCount(response.data.totalCertificates || 0)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="w-full overflow-hidden">
      {/* Navbar */}
      <Nav />

      {/* Hero Section */}
      <div id='home' className='w-full relative min-h-screen flex items-center justify-center pt-20 overflow-hidden'>

        {/* Advanced Background Layer */}
        <div className='absolute inset-0 z-0'>
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
            className='w-full h-full object-cover opacity-30 dark:opacity-20 transition-opacity duration-1000'
            alt="Hero Background"
          />
          <div className='absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-gray-50 dark:from-black/40 dark:via-black/80 dark:to-[#0b0b0b]'></div>

          {/* Animated Glows */}
          <div className='absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse'></div>
          <div className='absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full animate-pulse' style={{ animationDelay: '2s' }}></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

          {/* Content Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center lg:text-left space-y-8'
          >
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-inner group'>
              <span className='w-2 h-2 rounded-full bg-indigo-500 animate-ping'></span>
              <span className='text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest'>The Future of Learning</span>
            </div>

            <h1 className='text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[1.05]'>
              Unlock Your <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:300%_300%] animate-gradient'>Potential</span>
            </h1>

            <p className='max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed'>
              Embark on a journey of discovery with expert-led courses. Our AI-driven platform adapts to your pace, making education more personal and powerful than ever.
            </p>

            <div className='flex flex-wrap justify-center lg:justify-start gap-4'>
              <button
                className='flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-lg font-extrabold transition-all hover:scale-105 active:scale-95 shadow-2xl group'
                onClick={() => navigate("/allcourses")}
              >
                Join Now
                <SiViaplay className='w-5 h-5 group-hover:rotate-12 transition-transform' />
              </button>

              <button
                className='flex items-center gap-3 px-8 py-4 glass-effect dark:text-white rounded-2xl text-lg font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all border-white/40'
                onClick={() => navigate("/search")}
              >
                Search with AI
                <img src={ai} className='w-6 h-6 rounded-full shadow-lg' alt="AI" />
              </button>
            </div>

            <div className='flex items-center justify-center lg:justify-start gap-6 pt-4'>
              <div className='flex -space-x-3'>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className='w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-200 overflow-hidden'>
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className='text-sm text-gray-500 font-medium'>
                <span className='font-bold text-gray-900 dark:text-white'>{studentCount}+</span> students already joined
              </p>
            </div>
          </motion.div>

          {/* Decorative Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className='hidden lg:flex justify-center relative'
          >
            <div className='w-full max-w-[500px] aspect-square glass-effect rounded-[40px] shadow-2xl relative overflow-hidden group'>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                className='w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90'
                alt="Learning Platform"
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
              <div className='absolute bottom-8 left-8 right-8 p-6 glass-effect rounded-2xl border-white/20 backdrop-blur-md'>
                <div className='flex items-center gap-4 text-white'>
                  <div className='w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl'>
                    <FaStar />
                  </div>
                  <div>
                    <h4 className='font-bold text-lg'>Top Rated Platform</h4>
                    <p className='text-sm opacity-80'>Best ROI for your career</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className='absolute -top-10 -right-5 p-4 glass-effect rounded-2xl shadow-xl'
            >
              🚀 <span className='font-bold ml-1'>AI Powered</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className='absolute -bottom-5 -left-10 p-4 glass-effect rounded-2xl shadow-xl'
            >
              🎓 <span className='font-bold ml-1'>Certified</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Sections */}
      <div className='relative z-10 space-y-10'>
        <Logos />
        <ExploreCourses />
        <CardPage />
        <FeaturesSection certificateCount={certificateCount} />
        <About />
        <ReviewPage />
      </div>
      <Footer />
    </div>
  )
}

export default Home;
