import axios from 'axios';
import React, { useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../../constants';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const CreateCourses = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/course/create",
        { title, category },
        { withCredentials: true }
      );
      console.log(result.data);
      navigate("/courses")
      setLoading(false);
      toast.success("Course Created");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center relative overflow-hidden py-10 px-4'>
      {/* Background Shapes */}
      <div className='bg-shape bg-indigo-500 w-[400px] h-[400px] top-[-10%] right-[-10%] opacity-30'></div>
      <div className='bg-shape bg-purple-500 w-[300px] h-[300px] bottom-[-10%] left-[-10%] opacity-30'></div>

      <div className='glass-effect w-full max-w-lg p-8 md:p-10 rounded-3xl border-white/20 shadow-2xl relative'>
        <div
          className='absolute top-6 left-6 w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-black transition-all shadow-sm'
          onClick={() => navigate("/courses")}
        >
          <FaArrowLeftLong className='text-gray-700 dark:text-gray-300' />
        </div>

        <div className='text-center mt-8 mb-8'>
          <h2 className='text-3xl font-black text-gray-900 dark:text-white'>Create Course</h2>
          <p className='text-gray-500 dark:text-gray-400'>Start your journey as an educator</p>
        </div>

        <form className='space-y-6 md:space-y-8' onSubmit={handleCreateCourse}>
          <div className='space-y-2'>
            <label htmlFor="title" className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1'>
              Course Title
            </label>
            <input
              type="text"
              id="title"
              placeholder='e.g., Complete Web Development Bootcamp'
              className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white backdrop-blur-sm'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div className='space-y-2'>
            <label htmlFor="cat" className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1'>
              Course Category
            </label>
            <div className='relative'>
              <select
                id="cat"
                className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white backdrop-blur-sm appearance-none'
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                required
              >
                <option value="" className='bg-white dark:bg-zinc-900'>Select Category</option>
                <option value="App Development" className='bg-white dark:bg-zinc-900'>App Development</option>
                <option value="AI/ML" className='bg-white dark:bg-zinc-900'>AI/ML</option>
                <option value="AI Tools" className='bg-white dark:bg-zinc-900'>AI Tools</option>
                <option value="Data Science" className='bg-white dark:bg-zinc-900'>Data Science</option>
                <option value="Data Analytics" className='bg-white dark:bg-zinc-900'>Data Analytics</option>
                <option value="Ethical Hacking" className='bg-white dark:bg-zinc-900'>Ethical Hacking</option>
                <option value="UI/UX Designing" className='bg-white dark:bg-zinc-900'>UI/UX Designing</option>
                <option value="Web Development" className='bg-white dark:bg-zinc-900'>Web Development</option>
                <option value="Others" className='bg-white dark:bg-zinc-900'>Others</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className='w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center'
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color={loading ? "white" : "black"} /> : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourses;
