import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import image from "../../assets/empty.jpg";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../../constants";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../redux/courseSlice";

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const thumb = useRef();
  const [isPublished, setIsPublished] = useState(false);
  const [selectCourse, setSelectCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(image);
  const [backendImage, setBackendImage] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getcourse/${courseId}`,
        { withCredentials: true }
      );
      setSelectCourse(result.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch course details");
    }
  };

  useEffect(() => {
    if (selectCourse) {
      setTitle(selectCourse.title || "");
      setSubTitle(selectCourse.subTitle || "");
      setDescription(selectCourse.description || "");
      setCategory(selectCourse.category || "");
      setLevel(selectCourse.level || "");
      setPrice(selectCourse.price || "");
      setIsPublished(selectCourse.isPublished || false);
      setFrontendImage(selectCourse.thumbnail || image);
    }
  }, [selectCourse]);

  useEffect(() => {
    getCourseById();
  }, []);

  const handleEditCourse = async () => {
    setLoadingSave(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", price);
      formData.append("isPublished", isPublished);
      if (backendImage) formData.append("thumbnail", backendImage);

      const response = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const updateData = response.data;
      const updatedCourses = courseData.filter((c) => c._id !== courseId);
      updatedCourses.push(updateData);
      dispatch(setCourseData(updatedCourses));

      toast.success("Course Updated Successfully!");
      navigate("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleRemoveCourse = async () => {
    setLoadingRemove(true);
    try {
      await axios.delete(`${serverUrl}/api/course/remove/${courseId}`, {
        withCredentials: true,
      });
      const filterCourses = courseData.filter((c) => c._id !== courseId);
      dispatch(setCourseData(filterCourses));
      toast.success("Course Removed Successfully!");
      navigate("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove course!");
    } finally {
      setLoadingRemove(false);
    }
  };

  return (
    <div className='min-h-screen pt-20 pb-10 px-4 md:px-8 relative overflow-hidden'>
      <div className='bg-shape bg-teal-500 w-[500px] h-[500px] top-[-10%] right-[-20%] opacity-30'></div>
      <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] bottom-[10%] left-[-10%] opacity-30'></div>

      <div className="max-w-5xl mx-auto glass-effect rounded-3xl p-8 border-white/20 shadow-xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 relative">
          <div className="flex items-center gap-4">
            <div
              className='w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-black transition-all shadow-sm backdrop-blur-sm'
              onClick={() => navigate("/courses")}
            >
              <FaArrowLeftLong className='text-gray-700 dark:text-gray-300' />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              Edit Course Details
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-sm"
              onClick={() => selectCourse && navigate(`/createlecture/${selectCourse._id}`)}
            >
              Manage Lectures
            </button>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all text-sm"
              onClick={() => selectCourse && navigate(`/edit-quiz/${selectCourse._id}`)}
            >
              Manage Quiz
            </button>
            <button
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm"
              onClick={() => selectCourse && navigate(`/manage-assignments/${selectCourse._id}`)}
            >
              Assignments
            </button>
            <button
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm"
              onClick={() => selectCourse && navigate(`/analytics/${selectCourse._id}`)}
            >
              Analytics
            </button>
            <button
              className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-all text-sm"
              onClick={() => selectCourse && navigate(`/manage-qa/${selectCourse._id}`)}
            >
              Course Q&A
            </button>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Course Status</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm border ${!isPublished
                  ? "bg-green-100/80 text-green-700 border-green-200 hover:bg-green-200"
                  : "bg-yellow-100/80 text-yellow-700 border-yellow-200 hover:bg-yellow-200"}`}
                onClick={() => setIsPublished(!isPublished)}
              >
                {!isPublished ? "Publish Course" : "Unpublish Course"}
              </button>
              <button
                className="bg-red-500/10 text-red-600 border border-red-500/20 px-6 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
                onClick={handleRemoveCourse}
              >
                {loadingRemove ? <ClipLoader size={20} color="red" /> : "Delete Course"}
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Title</label>
                <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 outline-none dark:text-white" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Subtitle</label>
                <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 outline-none dark:text-white" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Description</label>
              <textarea className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 outline-none dark:text-white h-32 resize-none" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Category</label>
                <select className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 outline-none dark:text-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="AI Tools">AI Tools</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Ethical Hacking">Ethical Hacking</option>
                  <option value="UI/UX Designing">UI/UX Designing</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Complexity Level</label>
                <select className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 outline-none dark:text-white appearance-none" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Price (PKR)</label>
                <input type="number" className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-black/20 outline-none dark:text-white" placeholder="e.g. 1500" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Course Thumbnail</label>
              <input type="file" hidden ref={thumb} accept="image/*" onChange={handleThumbnail} />
              <div className="relative w-full md:w-[400px] h-[220px] cursor-pointer rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-700 group bg-white/50 dark:bg-black/20" onClick={() => thumb.current.click()}>
                <img src={frontendImage} alt="thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all">
                  <FaEdit className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-white/10">
              <button type="button" className="px-8 py-3 rounded-xl border border-gray-300 dark:border-zinc-600 font-bold text-gray-700 dark:text-gray-300" onClick={() => navigate("/courses")}>Cancel</button>
              <button type="button" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg" onClick={handleEditCourse}>
                {loadingSave ? <ClipLoader size={20} color="black" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;