import React from 'react';
import { FaStar, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Card = ({ thumbnail, title, category, price, id, reviews }) => {
  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAvgReview(reviews);
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -12 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-60 overflow-hidden m-3 rounded-[2rem]">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Category Overlay */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-black tracking-widest rounded-full border border-white/20">
            {category}
          </span>
        </div>

        {/* Rating Overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full shadow-lg">
          <FaStar className="text-amber-500 text-xs" />
          <span className="text-xs font-black text-gray-900 dark:text-white">{avgRating}</span>
        </div>

        {/* Play Overlay on Hover */}
        <div className='absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
          <div className='w-14 h-14 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500'>
            <FaArrowRight className='text-xl' />
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="px-8 pb-8 pt-4 space-y-4 flex flex-col flex-grow">
        <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[56px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h2>

        <div className='flex items-center gap-6 py-2'>
          <div className='flex flex-col'>
            <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Enrollment Price</span>
            <span className='text-2xl font-black text-gray-900 dark:text-white tracking-tighter'>${price}</span>
          </div>
          <div className='flex-grow h-[1px] bg-gray-100 dark:bg-white/5'></div>
          <div className='w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all'>
            <FaArrowRight className='text-sm' />
          </div>
        </div>
      </div>

      {/* Bottom accent glow */}
      <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
    </motion.div>
  );
};

export default Card;
