import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import { motion } from 'framer-motion';
import { HiOutlineSparkles } from "react-icons/hi2";

const CardPage = () => {
    const { courseData } = useSelector(state => state.course);
    const [popularCourses, setPopularCourses] = useState([]);

    useEffect(() => {
        if (Array.isArray(courseData)) {
            // Sort by reviews length or just take first 6
            const sorted = [...courseData].sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
            setPopularCourses(sorted.slice(0, 6));
        }
    }, [courseData]);

    return (
        <section id="popular-courses" className="w-full py-24 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className='absolute top-1/4 -right-20 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full -z-10'></div>
            <div className='absolute bottom-1/4 -left-20 w-[300px] h-[300px] bg-purple-500/5 blur-[80px] rounded-full -z-10'></div>

            <div className='max-w-7xl mx-auto flex flex-col items-center'>

                {/* Header Section */}
                <div className='text-center space-y-4 mb-16'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20'
                    >
                        <HiOutlineSparkles className='w-4 h-4' />
                        <span className='text-[10px] font-black uppercase tracking-[0.2em]'>Most Wanted</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className='text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight'
                    >
                        Our <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'>Popular</span> Courses
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className='max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed'
                    >
                        Discover the most transformative learning experiences. Hand-picked courses designed to move your career forward in the AI-driven era.
                    </motion.p>
                </div>

                {/* Courses Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {popularCourses?.map((course, index) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Card
                                thumbnail={course.thumbnail}
                                title={course.title}
                                category={course.category}
                                price={course.price}
                                id={course._id}
                                reviews={course.reviews}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Mobile 'Browse All' button could go here */}
            </div>
        </section>
    );
};

export default CardPage;
