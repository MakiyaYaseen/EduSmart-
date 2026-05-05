import React, { useState, useEffect } from 'react'
import logo from "../assets/logo.jpg"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../constants'
import { FaTwitter, FaLinkedinIn, FaInstagram, FaGithub, FaYoutube, FaDiscord } from 'react-icons/fa'
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi'
import { motion } from 'framer-motion'

const Footer = () => {
  const navigate = useNavigate()
  const [studentCount, setStudentCount] = useState(0)

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

  const socialLinks = [
    { icon: <FaTwitter />, color: "hover:text-[#1DA1F2]", label: "Twitter" },
    { icon: <FaLinkedinIn />, color: "hover:text-[#0077B5]", label: "LinkedIn" },
    { icon: <FaInstagram />, color: "hover:text-[#E4405F]", label: "Instagram" },
    { icon: <FaGithub />, color: "hover:text-[#fafafa]", label: "GitHub" },
    { icon: <FaYoutube />, color: "hover:text-[#FF0000]", label: "YouTube" },
    { icon: <FaDiscord />, color: "hover:text-[#5865F2]", label: "Discord" }
  ]

  const navLinks = [
    {
      title: "Platform", links: [
        { name: "Home", path: "/" },
        { name: "Explore Courses", path: "/allcourses" },
        { name: "AI Search", path: "/search" },
        { name: "Educator Portal", path: "/dashboard" }
      ]
    },
    {
      title: "Categories", links: [
        { name: "Web Development", path: "/allcourses?cat=Web%20Development" },
        { name: "Data Science", path: "/allcourses?cat=Data%20Science" },
        { name: "AI & Machine Learning", path: "/allcourses?cat=AI%2FML" },
        { name: "UI/UX Designing", path: "/allcourses?cat=UI%2FUX%20Designing" }
      ]
    },
    {
      title: "Support", links: [
        { name: "Help Center", path: "#" },
        { name: "Terms of Service", path: "#" },
        { name: "Privacy Policy", path: "#" },
        { name: "Contact Us", path: "#" }
      ]
    }
  ]

  return (
    <footer id='contact' className='relative bg-[#080809] pt-24 pb-12 px-6 overflow-hidden border-t border-white/5'>
      {/* Dynamic Background Glows */}
      <div className='absolute top-0 left-[20%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -z-10 pointer-events-none opacity-50'></div>
      <div className='absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10 pointer-events-none opacity-50'></div>

      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20'>

          {/* Brand & Description Section */}
          <div className='lg:col-span-4 space-y-8'>
            <div className='flex items-center gap-3 group cursor-pointer' onClick={() => navigate("/")}>
              <div className='relative'>
                <div className='absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity'></div>
                <img src={logo} alt="LearnAI" className='w-12 h-12 rounded-xl relative border border-white/10 shadow-2xl' />
              </div>
              <span className='text-3xl font-black text-white tracking-tighter'>EduSmart</span>
            </div>

            <p className='text-lg leading-relaxed text-gray-400 font-medium'>
              We are building the world's most intelligent learning ecosystem, empowering <span className='text-white font-bold'>{studentCount}+</span> students to master the technologies of tomorrow.
            </p>

            <div className='flex flex-wrap gap-3'>
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -5, scale: 1.1 }}
                  href="#"
                  className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 text-xl transition-all duration-300 ${social.color} hover:bg-white/10 hover:border-white/20 hover:shadow-lg`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className='lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-10'>
            {navLinks.map((section, idx) => (
              <div key={idx} className='space-y-6'>
                <h3 className='text-white font-black text-xs uppercase tracking-[0.25em]'>{section.title}</h3>
                <ul className='space-y-4'>
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className='text-gray-500 hover:text-white cursor-pointer transition-all duration-300 flex items-center gap-2 group text-sm font-bold'
                      onClick={() => link.path.startsWith("/") ? navigate(link.path) : null}
                    >
                      <span className='w-0 group-hover:w-2 h-[2px] bg-indigo-500 transition-all duration-300'></span>
                      {link.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter / Status Area */}
          <div className='lg:col-span-3 space-y-8'>
            <h3 className='text-white font-black text-xs uppercase tracking-[0.25em]'>Stay Updated</h3>
            <p className='text-sm text-gray-500 font-bold'>
              Join our newsletter to get latest updates on AI courses and tech masterclasses.
            </p>

            {/* Status Indicator */}
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full'>
              <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></div>
              <span className='text-[10px] font-black text-emerald-500 uppercase tracking-widest'>Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className='pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8'>
          <div className='order-2 md:order-1'>
              &copy; {new Date().getFullYear()} <span className='text-gray-400'>EduSmart Technologies.</span> All Excellence Reserved.
          </div>

          <div className='flex items-center gap-10 order-1 md:order-2'>
            <div className='flex items-center gap-2 text-gray-600 text-sm'>
              <span className='w-1.5 h-1.5 rounded-full bg-indigo-500/40'></span>
              Built for the Future of Tech
            </div>
            <div className='hidden md:flex gap-6 uppercase text-[10px] font-black tracking-widest text-gray-600'>
              <span className='hover:text-white cursor-pointer transition-colors'>Security</span>
              <span className='hover:text-white cursor-pointer transition-colors'>Privacy</span>
              <span className='hover:text-white cursor-pointer transition-colors'>Status</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer