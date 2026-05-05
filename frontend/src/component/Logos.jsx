import React from 'react'
import { MdOutlineAutoAwesome, MdOutlineCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar, FaUsers, FaCertificate } from "react-icons/fa6";
import { BiSupport, BiTimeFive } from "react-icons/bi";
import { IoRocketOutline } from "react-icons/io5";

const Logos = () => {
  const features = [
    { icon: <MdOutlineCastForEducation />, text: "Expert-Led Courses", color: "text-indigo-600 dark:text-indigo-400" },
    { icon: <SiOpenaccess />, text: "Lifetime Access", color: "text-purple-600 dark:text-purple-400" },
    { icon: <FaSackDollar />, text: "Value for Money", color: "text-green-600 dark:text-green-400" },
    { icon: <BiSupport />, text: "24/7 Support", color: "text-blue-600 dark:text-blue-400" },
    { icon: <FaUsers />, text: "Active Community", color: "text-orange-600 dark:text-orange-400" },
    { icon: <MdOutlineAutoAwesome />, text: "AI-Powered Learning", color: "text-pink-600 dark:text-pink-400" },
    { icon: <FaCertificate />, text: "Verified Certificates", color: "text-yellow-600 dark:text-yellow-400" },
    { icon: <BiTimeFive />, text: "Flexible Schedule", color: "text-teal-600 dark:text-teal-400" },
    { icon: <IoRocketOutline />, text: "Career Growth", color: "text-cyan-600 dark:text-cyan-400" },
  ];

  return (
    <div className='w-full py-20 px-6 relative'>
      <div className='max-w-7xl mx-auto flex flex-col items-center text-center gap-14'>

        {/* Section Header */}
        <div className='space-y-4 max-w-3xl'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20'>
            <span className='w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse'></span>
            <span className='text-[10px] font-black uppercase tracking-[0.25em]'>Our Excellence</span>
          </div>
          <h2 className='text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight'>
            Why Choose <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'>EduSmart?</span>
          </h2>
          <p className='text-gray-500 dark:text-gray-400 font-medium text-lg'>
            Elevate your skills with our unique features designed to help you succeed in the digital age.
          </p>
        </div>

        {/* Balanced 3x3 Grid Layout */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='glass-effect px-7 py-6 rounded-[2rem] flex flex-col items-center text-center gap-4 font-bold text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 cursor-default border-white/20 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md group'
            >
              <div className='w-14 h-14 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform'>
                <span className={`text-3xl ${feature.color}`}>
                  {feature.icon}
                </span>
              </div>
              <span className='text-base md:text-lg tracking-tight'>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Logos