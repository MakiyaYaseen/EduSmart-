import React, { useEffect } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import img from "../../assets/empty.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../../constants';
import axios from 'axios';
import { setCreatorCourseData } from '../../redux/courseSlice';

const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { creatorCourseData } = useSelector(state => state.course);

  useEffect(() => {
    if (!userData) return;

    const fetchCreatorCourses = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreator", { withCredentials: true });
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchCreatorCourses();
  }, [dispatch, userData]);

  return (
    <div className='min-h-screen pt-20 pb-10 px-4 md:px-8 relative overflow-hidden'>
      {/* Background Shapes */}
      <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] top-[-10%] right-[-20%] opacity-30'></div>
      <div className='bg-shape bg-purple-500 w-[500px] h-[500px] bottom-[10%] left-[-10%] opacity-30'></div>

      <div className='max-w-7xl mx-auto'>

        {/* HEADER */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4'>
          <div className='flex items-center justify-start gap-4'>
            <div
              className='w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors'
              onClick={() => navigate("/dashboard")}
            >
              <FaArrowLeftLong className='w-4 h-4 text-gray-700 dark:text-gray-300' />
            </div>
            <div>
              <h1 className='text-3xl font-black text-gray-900 dark:text-white'>My Courses</h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Manage your created content</p>
            </div>
          </div>

          <button
            className='bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2'
            onClick={() => navigate("/createCourse")}
          >
            <span>+ Create New Course</span>
          </button>
        </div>

        {/* TABLE – LARGE SCREENS */}
        <div className='hidden md:block glass-effect rounded-3xl p-1 overflow-hidden border-white/20 shadow-xl'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left'>
              <thead className='text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-white/5'>
                <tr>
                  <th scope="col" className='px-6 py-4 font-bold tracking-wider'>Course Title</th>
                  <th scope="col" className='px-6 py-4 font-bold tracking-wider text-center'>Price</th>
                  <th scope="col" className='px-6 py-4 font-bold tracking-wider text-center'>Status</th>
                  <th scope="col" className='px-6 py-4 font-bold tracking-wider text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-white/5'>
                {creatorCourseData?.map((course, index) => (
                  <tr key={index} className='bg-white/40 dark:bg-zinc-900/40 hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-colors backdrop-blur-sm'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-4'>
                        <img
                          src={course?.thumbnail || img}
                          className='w-16 h-12 object-cover rounded-lg shadow-sm'
                          alt="course thumbnail"
                        />
                        <span className='font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[200px] lg:max-w-xs'>{course?.title}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-center font-bold text-gray-700 dark:text-gray-300'>
                      PKR {course.price ? course.price.toLocaleString() : "Free"}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${course.isPublished ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <button
                        className='p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-gray-600 dark:text-gray-400'
                        onClick={() => navigate(`/editCourse/${course?._id}`)}
                        title="Edit Course"
                      >
                        <FaEdit className='w-5 h-5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {creatorCourseData?.length === 0 && (
            <div className='p-10 text-center text-gray-500 dark:text-gray-400'>
              No courses found. Create your first course today!
            </div>
          )}
        </div>

        {/* SMALL SCREEN VIEW */}
        <div className='md:hidden space-y-4'>
          {creatorCourseData?.map((course, index) => (
            <div key={index} className='glass-effect rounded-2xl p-4 flex flex-col gap-4 border-white/20 shadow-lg bg-white/40 dark:bg-black/40'>
              <div className='flex gap-4 items-start'>
                <img
                  src={course?.thumbnail || img}
                  alt="thumbnail"
                  className='w-20 h-20 rounded-xl object-cover shadow-sm'
                />
                <div className='flex-1 min-w-0'>
                  <h2 className='font-bold text-gray-900 dark:text-white text-base line-clamp-2 leading-tight'>{course?.title}</h2>
                  <p className='text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium'>
                    PKR {course.price ? course.price.toLocaleString() : "Free"}
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-white/10'>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {course.isPublished ? "Published" : "Draft"}
                </span>
                <button
                  className='flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold'
                  onClick={() => navigate(`/editCourse/${course?._id}`)}
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
          ))}
          {creatorCourseData?.length === 0 && (
            <div className='text-center py-10 text-gray-500'>No courses found.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Courses;
