import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaCamera, FaUser, FaEnvelope, FaQuoteLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../constants';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../component/Nav';

const EditProfile = () => {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const [name, setName] = useState(userData?.name || "");
  const [description, setDescription] = useState(userData?.description || "");
  const [photoUrl, setPhotUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Handle image preview
  useEffect(() => {
    if (!photoUrl) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photoUrl);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photoUrl]);

  const handleEditProfile = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (photoUrl) {
      formData.append("photoUrl", photoUrl);
    }

    try {
      const result = await axios.post(
        serverUrl + "/api/user/profile",
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success("Profile Updated Successfully");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-[#09090b] relative overflow-hidden'>
      {/* Background Decorations */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full'></div>
        <div className='absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full'></div>
      </div>

      <Nav />

      <div className='relative z-10 pt-[120px] pb-20 px-4 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='w-full max-w-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[40px] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden'
        >
          {/* Header */}
          <div className='relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600'>
            <button
              onClick={() => navigate("/profile")}
              className='absolute top-6 left-6 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95'
            >
              <FaArrowLeftLong />
            </button>
          </div>

          <div className='px-8 pb-12 -mt-16'>
            <form className='space-y-8' onSubmit={(e) => e.preventDefault()}>
              {/* Avatar Section */}
              <div className='flex flex-col items-center gap-4'>
                <div className='relative group'>
                  <div className='w-32 h-32 rounded-[32px] overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl bg-gray-100 dark:bg-zinc-800 focus-within:ring-4 focus-within:ring-indigo-500 transition-all'>
                    {previewUrl || userData?.photoUrl ? (
                      <img
                        src={previewUrl || userData.photoUrl}
                        className='w-full h-full object-cover transition-transform group-hover:scale-110'
                        alt="Avatar Preview"
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-4xl font-black text-indigo-500'>
                        {name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}

                    <label
                      htmlFor="photo-upload"
                      className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
                    >
                      <FaCamera className='text-white text-2xl' />
                    </label>
                  </div>
                  <input
                    type="file"
                    id="photo-upload"
                    className='hidden'
                    accept='image/*'
                    onChange={(e) => setPhotUrl(e.target.files[0])}
                  />
                  <div className='absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg'>
                    <FaCamera size={14} />
                  </div>
                </div>
                <div className='text-center'>
                  <h2 className='text-2xl font-black text-gray-900 dark:text-white'>Profile Settings</h2>
                  <p className='text-sm text-gray-500 font-medium'>Update your public appearance</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Name Input */}
                <div className='space-y-2'>
                  <label className='text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                    <FaUser className='text-indigo-500' /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full bg-gray-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-bold outline-none transition-all'
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Display (Read-only) */}
                <div className='space-y-2'>
                  <label className='text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                    <FaEnvelope className='text-indigo-500' /> Email Address
                  </label>
                  <div className='w-full bg-gray-100 dark:bg-zinc-800/30 border-2 border-transparent rounded-2xl px-5 py-4 text-gray-400 font-bold flex items-center gap-3'>
                    <span className='truncate'>{userData?.email}</span>
                    <span className='text-[10px] bg-gray-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full whitespace-nowrap'>Verified</span>
                  </div>
                </div>
              </div>

              {/* Bio Input */}
              <div className='space-y-2'>
                <label className='text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                  <FaQuoteLeft className='text-indigo-500' /> About Me
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className='w-full bg-gray-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-bold outline-none transition-all resize-none'
                  placeholder="Tell the world about yourself..."
                />
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <button
                  onClick={() => navigate("/profile")}
                  className='flex-1 py-4 px-8 border-2 border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all'
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  disabled={loading}
                  className='flex-1 py-4 px-8 bg-black dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3'
                >
                  {loading ? (
                    <ClipLoader size={24} color='currentColor' />
                  ) : (
                    "Save Profile Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
