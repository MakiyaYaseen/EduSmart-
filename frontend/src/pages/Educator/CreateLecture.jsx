import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../constants';
import { setLectureData } from '../../redux/lectureSlice';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";


const CreateLecture = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { lectureData } = useSelector(state => state.lecture);

  const handleCreateLecture = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + `/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true });
      console.log(result.data)

      dispatch(setLectureData([...lectureData, result.data.lecture]));
      setLectureTitle("");
      setLoading(false);
      toast.success("Lecture Added")
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Server Error")
    }
  };
  useEffect(() => {
    const getCourseLecture = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/courselecture/${courseId}`, { withCredentials: true })
        console.log(result.data)
        dispatch(setLectureData(result.data.lectures))
      } catch (error) {
        console.log(error)
      }
    }

    getCourseLecture(); // <--- Isay yahan ANDAR call karein
  }, [courseId, dispatch]) // Dependency array update karein

  return (
    <div className='min-h-screen pt-20 pb-10 px-4 md:px-8 relative overflow-hidden flex items-center justify-center'>
      {/* Background Shapes */}
      <div className='bg-shape bg-indigo-500 w-[400px] h-[400px] top-[-10%] right-[-10%] opacity-30'></div>
      <div className='bg-shape bg-purple-500 w-[300px] h-[300px] bottom-[-10%] left-[-10%] opacity-30'></div>

      <div className='glass-effect w-full max-w-2xl p-8 rounded-3xl border-white/20 shadow-2xl relative z-10'>

        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-black text-gray-900 dark:text-white mb-2'>Add New Lecture</h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Enhance your course content by adding detailed video lectures.
          </p>
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <label htmlFor="lectureTitle" className='block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1'>
              Lecture Title
            </label>
            <input
              type="text"
              id="lectureTitle"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className='w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white backdrop-blur-sm'
              placeholder='e.g. Introduction to Mern Stack'
            />
          </div>

          <div className='flex gap-4 pt-4'>
            <button
              className='flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-300'
              onClick={() => navigate(`/editcourse/${courseId}`)}
            >
              <FaArrowLeftLong /> Back
            </button>

            <button
              onClick={handleCreateLecture}
              className='flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center'
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color={loading ? "white" : "black"} /> : "+ Create Lecture"}
            </button>
          </div>
        </div>

        {/* lecture list */}
        <div className='mt-10 space-y-3' >
          <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4 pl-1'>Existing Lectures</h3>
          {lectureData?.length > 0 ? (
            lectureData.map((lecture, index) => (
              <div
                key={lecture._id || index}
                className='bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-xl flex justify-between items-center p-4 border border-white/20 hover:bg-white/60 dark:hover:bg-white/10 transition-colors'
              >
                <span className='font-medium text-gray-800 dark:text-gray-200 truncate pr-4'>
                  <span className='font-bold text-indigo-600 dark:text-indigo-400 mr-2'>#{index + 1}</span>
                  {lecture.lectureTitle}
                </span>
                <button
                  className='p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-gray-600 dark:text-gray-400'
                  onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                  title="Edit Lecture"
                >
                  <FaEdit className='w-5 h-5' />
                </button>
              </div>
            ))
          ) : (
            <div className='text-center py-8 text-gray-500 dark:text-gray-400 bg-white/20 dark:bg-black/20 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700'>
              No lectures added yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreateLecture;
