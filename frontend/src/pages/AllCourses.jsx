import React, { useEffect, useState } from 'react'
import Nav from '../component/Nav'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useSearchParams } from 'react-router-dom';
import ai from "../assets/SearchAi.png"
import { useSelector } from 'react-redux';
import Card from '../component/Card';
import SkeletonCard from '../component/SkeletonCard';
import { motion } from 'framer-motion';

const AllCourses = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { courseData } = useSelector(state => state.course)

    const [category, setCategory] = useState(
        searchParams.get('cat') ? [searchParams.get('cat')] : []
    )
    const [filterCourses, setFilterCourses] = useState([])
    const [isSidebarVisible, SetIsSidebarVisible] = useState(false)

    const toggleCategory = (e) => {
        const value = e.target.value;

        if (category.includes(value)) {
            setCategory(prev => prev.filter(c => c !== value))
        } else {
            setCategory(prev => [...prev, value])
        }
    }

    const applyFilter = () => {
        let courseCopy = courseData?.slice() || [];

        if (category.length > 0) {
            courseCopy = courseCopy.filter(c => category.includes(c.category))
        }

        setFilterCourses(courseCopy)
    }

    useEffect(() => {
        setFilterCourses(courseData)
    }, [courseData])

    useEffect(() => {
        applyFilter()
    }, [category])


    return (
        <div className='min-h-screen w-full relative overflow-hidden'>
            <Nav />
            {/* Background Shapes */}
            <div className='bg-shape bg-indigo-500 w-[600px] h-[600px] top-[10%] left-[-20%] opacity-20'></div>
            <div className='bg-shape bg-purple-500 w-[500px] h-[500px] bottom-[10%] right-[-10%] opacity-20'></div>

            <button className='fixed top-24 left-4 z-50 bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-lg font-bold md:hidden' onClick={() => SetIsSidebarVisible(prev => !prev)} >
                {isSidebarVisible ? 'Hide' : "Show"} Filters
            </button>

            {/* Sidebar */}
            <aside
                className={`w-[300px] h-screen overflow-y-auto glass-effect fixed top-0 left-0 p-8 pt-[120px] border-r border-white/20 shadow-2xl transition-transform duration-300 z-40 ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} md:block md:translate-x-0 bg-white/70 dark:bg-black/70`}
            >
                <h2 className='text-2xl font-black text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3'>
                    <FaArrowLeftLong className='cursor-pointer text-indigo-600 dark:text-indigo-400' onClick={() => navigate("/")} />
                    Filters
                </h2>

                <div className='space-y-6'>
                    <button
                        className='w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95' onClick={() => navigate("/search")}
                    >
                        Search with AI
                        <img src={ai} className='w-[24px] h-[24px] rounded-full shadow-sm' alt="" />
                    </button>

                    <div className='p-6 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20'>
                        <h3 className='text-xs font-black text-gray-400 uppercase tracking-widest mb-6'>Categories</h3>
                        <div className='space-y-4'>
                            {[
                                "App Development", "AI/ML", "AI Tools", "Data Science",
                                "Data Analytics", "Ethical Hacking", "UI/UX Designing",
                                "Web Development", "Others"
                            ].map((cat) => (
                                <label key={cat} className='flex items-center gap-3 cursor-pointer group'>
                                    <div className='relative flex items-center'>
                                        <input
                                            value={cat}
                                            checked={category.includes(cat)}
                                            onChange={toggleCategory}
                                            type="checkbox"
                                            className='peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-zinc-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all'
                                        />
                                        <svg className="absolute w-3 h-3 text-white hidden peer-checked:block left-1 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className='text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className='w-full min-h-screen transition-all duration-300 pt-[120px] pb-20 md:pl-[340px] px-6'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex items-center justify-between mb-12'>
                        <div>
                            <h1 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3'>Explore Courses</h1>
                            <p className='text-lg text-gray-500 dark:text-gray-400 font-medium'>Find the perfect course to advance your career</p>
                        </div>
                        <div className='text-right hidden sm:block'>
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-black text-4xl'>{filterCourses?.length || 0}</span>
                            <p className='text-xs text-gray-400 uppercase font-bold tracking-widest mt-1'>Courses Found</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {!courseData ? (
                            // Show Skeletons while loading
                            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                        ) : filterCourses?.length > 0 ? (
                            filterCourses.map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className='glass-effect rounded-[32px] overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white/40 dark:bg-black/40'>
                                        <Card
                                            thumbnail={course.thumbnail}
                                            title={course.title}
                                            category={course.category}
                                            price={course.price}
                                            id={course._id}
                                            reviews={course.reviews}
                                        />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className='col-span-full py-32 text-center glass-effect rounded-3xl border-white/20'>
                                <div className='text-6xl mb-4'>🔍</div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>No courses found</h3>
                                <p className='text-gray-500 font-medium'>Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AllCourses
