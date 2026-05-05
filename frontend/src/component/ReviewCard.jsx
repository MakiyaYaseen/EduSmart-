import React from 'react'
import { FaStar, FaRegStar, FaQuoteLeft } from "react-icons/fa";

function ReviewCard({ comment, rating, photoUrl, name, description, courseTitle }) {
    return (
        <div className='glass-effect p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 max-w-sm w-full border border-white/20 group hover:-translate-y-2 flex flex-col h-full bg-white/40 dark:bg-black/40 backdrop-blur-md'>

            {/* Quote Icon */}
            <div className='absolute top-6 right-8 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors'>
                <FaQuoteLeft className='text-6xl' />
            </div>

            {/* Stars */}
            <div className='flex items-center mb-6 text-amber-400 gap-1 relative z-10'>
                {
                    Array(5).fill(0).map((_, index) => (
                        <span key={index} className='text-sm transition-transform group-hover:scale-110 duration-300' style={{ transitionDelay: `${index * 50}ms` }}>
                            {index < rating ? <FaStar /> : <FaRegStar className='opacity-30 text-gray-400' />}
                        </span>
                    ))
                }
            </div>

            {/* Comment */}
            <div className='flex-grow relative z-10 space-y-4 mb-8'>
                <p className='text-gray-800 dark:text-gray-200 font-bold text-lg leading-relaxed italic line-clamp-4'>
                    "{comment}"
                </p>
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-500/20 flex items-center gap-1'>
                        <span className='w-1 h-1 rounded-full bg-green-500 animate-pulse'></span>
                        Verified Student
                    </span>
                    {courseTitle && (
                        <span className='text-[10px] text-gray-400 uppercase font-black tracking-widest truncate max-w-[150px]'>
                            {courseTitle}
                        </span>
                    )}
                </div>
            </div>

            {/* User Info */}
            <div className='flex items-center gap-4 pt-6 border-t border-gray-200/50 dark:border-white/5 relative z-10'>
                <div className='relative'>
                    {photoUrl ? (
                        <img src={photoUrl} className='w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30' alt={name} />
                    ) : (
                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg font-black border-2 border-white/20'>
                            {name?.slice(0, 1)?.toUpperCase() || 'U'}
                        </div>
                    )}
                    <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 border-2 border-white dark:border-zinc-900 rounded-full flex items-center justify-center text-[10px] text-white shadow-lg'>✓</div>
                </div>
                <div className='overflow-hidden'>
                    <h2 className='font-black text-gray-900 dark:text-white text-base tracking-tight truncate'>{name}</h2>
                    <p className='text-xs text-gray-500 dark:text-gray-400 font-bold tracking-tight truncate'>{description || "Professional Student"}</p>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard