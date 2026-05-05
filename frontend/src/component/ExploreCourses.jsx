import React from 'react'
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdOutlineAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa6";
import { RiOpenaiFill } from "react-icons/ri";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboardData } from "react-icons/bs";
import { SiOpenaigym } from "react-icons/si";
import { useNavigate } from 'react-router-dom';

const ExploreCourses = () => {
  const navigate = useNavigate()
  return (
    <div className='w-full min-h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-20 relative'>

      {/* Description Section */}
      <div className='w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 z-10' >
        <span className='px-4 py-1.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20'>
          Curriculum
        </span>
        <h2 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight'>
          Explore Our <br />
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'>Top Categories</span>
        </h2>
        <p className='text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md'>
          Discover a variety of courses designed to enhance your skills in web development, AI, data science, and more. Learn at your own pace and gain practical knowledge.
        </p>
        <button
          className='mt-4 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3'
          onClick={() => navigate("/allcourses")}
        >
          Browse All Courses <SiViaplay className='w-5 h-5' />
        </button>
      </div>

      {/* Cards Grid */}
      <div className='flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 z-10'>

        {[
          { Icon: TbDeviceDesktopAnalytics, name: "Web Development", color: "text-blue-500" },
          { Icon: LiaUikit, name: "UI/UX Designing", color: "text-pink-500" },
          { Icon: MdOutlineAppShortcut, name: "App Development", color: "text-green-500" },
          { Icon: FaHackerrank, name: "Ethical Hacking", color: "text-red-500" },
          { Icon: RiOpenaiFill, name: "AI/ML", color: "text-purple-500" },
          { Icon: SiGoogledataproc, name: "Data Science", color: "text-yellow-500" },
          { Icon: BsClipboardData, name: "Data Analytics", color: "text-orange-500" },
          { Icon: SiOpenaigym, name: "AI Tools", color: "text-teal-500" },
        ].map((item, index) => (
          <div
            key={index}
            className='glass-effect p-6 rounded-3xl border-white/20 hover:border-indigo-500/50 hover:bg-white/60 dark:hover:bg-zinc-800/60 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center gap-4 cursor-pointer text-center bg-white/30 dark:bg-zinc-900/30'
            onClick={() => navigate(`/allcourses?cat=${encodeURIComponent(item.name)}`)}
          >
            <div className={`p-4 rounded-2xl bg-white dark:bg-black/50 shadow-sm ${item.color.replace('text-', 'bg-').replace('500', '100')} dark:bg-opacity-20`}>
              <item.Icon className={`w-8 h-8 ${item.color}`} />
            </div>
            <span className='font-bold text-gray-800 dark:text-gray-200 text-[11px] md:text-sm'>{item.name}</span>
          </div>
        ))}

      </div>
    </div>
  )
}

export default ExploreCourses;
