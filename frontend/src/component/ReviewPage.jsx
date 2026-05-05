import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ReviewCard from './ReviewCard.jsx'
import { FaStar } from 'react-icons/fa'
import { motion } from 'framer-motion'

const ReviewPage = () => {
  const { reviewData } = useSelector(state => state.review)
  const [latestReview, setLatestReview] = useState([])

  useEffect(() => {
    if (reviewData) {
      setLatestReview(reviewData?.slice(0, 6))
    }
  }, [reviewData])

  return (
    <div id='reviews' className='w-full py-24 relative overflow-hidden'>
      {/* Decorative Gradients */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full -z-10'></div>

      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex flex-col md:flex-row items-end justify-between gap-8 mb-16'>
          <div className='space-y-4 text-left'>
            <span className='inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-indigo-500/20'>
              The Success Stories
            </span>
            <h2 className='text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1]'>
              What Our <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient'>Learners Say</span>
            </h2>
          </div>

          {/* Quick Stats */}
          <div className='flex items-center gap-6 glass-effect p-6 rounded-[2rem] border-white/20 shadow-xl'>
            <div className='text-center'>
              <div className='flex items-center justify-center text-amber-500 gap-1 mb-1'>
                {[1, 2, 3, 4, 5].map(star => <FaStar key={star} className='w-4 h-4' />)}
              </div>
              <p className='text-2xl font-black text-gray-900 dark:text-white leading-none'>4.9/5.0</p>
              <p className='text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1'>Avg. Rating</p>
            </div>
            <div className='h-12 w-[2px] bg-gray-100 dark:bg-white/10'></div>
            <div className='text-center'>
              <p className='text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none'>{reviewData?.length || 0}+</p>
              <p className='text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1'>Total Reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {latestReview?.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ReviewCard
                rating={review.rating}
                comment={review.comment}
                name={review.user?.name}
                photoUrl={review.user?.photoUrl}
                courseTitle={review.course?.title}
                description={review.user?.description}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action Footer */}
        <div className='text-center mt-20'>
          <p className='text-gray-500 dark:text-gray-400 font-bold'>
            Join <span className='text-gray-900 dark:text-white underline decoration-indigo-500 decoration-2'>thousands</span> of happy students starting their tech career today.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReviewPage