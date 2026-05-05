import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ForgetPassword from './pages/ForgetPassword';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/Educator/Dashboard';
import Courses from './pages/Educator/Courses';
import CreateCourses from './pages/Educator/CreateCourses';
import EditCourse from './pages/Educator/EditCourse';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useGetCurrentUser from './customHooks/getCurrentUser';
import useGetCreatorCourse from './customHooks/getCreatorCourse';
import useGetPublishedCourse from './customHooks/getPublishedCourse';
import { useSelector } from 'react-redux';
import AllCourses from './pages/AllCourses';
import CreateLecture from './pages/Educator/CreateLecture';
import EditLecture from './pages/Educator/EditLecture';
import ViewCourse from './pages/ViewCourse';
import ScrollToTop from './component/ScrollToTop';
import PaymentSuccess from './component/PaymentSuccess';
import ViewLectures from './pages/ViewLectures';
import MyEnrolledCourses from './pages/MyEnrolledCourses';
import useGetAllReviews from './customHooks/getAllReviews';
import SearchWIthAi from './pages/SearchWIthAi';
import ManageQuiz from "./pages/Educator/ManageQuiz";
import ManageAssignments from './pages/Educator/ManageAssignments';
import CourseAnalytics from './pages/Educator/CourseAnalytics';
import AiFloatingChat from './component/AiFloatingChat';
import ManageQA from './pages/Educator/ManageQA';
const App = () => {
  const loading = useGetCurrentUser();
  useGetCreatorCourse();
  useGetPublishedCourse();
  useGetAllReviews();
  const { userData } = useSelector(state => state.user);
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#09090b]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
          <p className='text-gray-500 dark:text-gray-400 font-medium animate-pulse'>Loading EduSmart...</p>
        </div>
      </div>
    );
  }
  return (
    <div className='relative min-h-screen overflow-x-hidden'>
      <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] top-[-10%] left-[-10%]'></div>
      <div className='bg-shape bg-purple-500 w-[400px] h-[400px] bottom-[10%] right-[-5%]'></div>
      <div className='bg-shape bg-pink-500 w-[300px] h-[300px] top-[50%] left-[40%]'></div>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/signup'
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path='/login'
          element={!userData ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path='/profile'
          element={userData ? <Profile /> : <Navigate to="/signup" />}
        />
        <Route path='/forget' element={<ForgetPassword />} />
        <Route
          path='/editprofile'
          element={userData ? <EditProfile /> : <Navigate to="/signup" />}
        />
        <Route
          path='/allcourses'
          element={userData ? <AllCourses /> : <Navigate to="/signup" />}
        />
        <Route
          path='/dashboard'
          element={userData?.role === "educator" ? <Dashboard /> : <Navigate to="/signup" />}
        />
        <Route
          path='/courses'
          element={userData?.role === "educator" ? <Courses /> : <Navigate to="/signup" />}
        />
        <Route
          path='/createCourse'
          element={userData?.role === "educator" ? <CreateCourses /> : <Navigate to="/signup" />}
        />
        <Route
          path='/editcourse/:courseId'
          element={userData?.role === "educator" ? <EditCourse /> : <Navigate to="/signup" />}
        />
        <Route
          path='/createlecture/:courseId'
          element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to="/signup" />}
        />
        <Route
          path='/editlecture/:courseId/:lectureId'
          element={userData?.role === "educator" ? <EditLecture /> : <Navigate to="/signup" />}
        />
        <Route
          path='/viewcourse/:courseId'
          element={userData ? <ViewCourse /> : <Navigate to="/signup" />}
        />
        <Route path="/payment-success" element={userData ? <PaymentSuccess /> : <Navigate to="/signup" />} />
        <Route
          path='/viewlecture/:courseId' element={userData?.role === "student" ? <ViewLectures /> : <Navigate to="/signup" />}
        />
        <Route
          path='/mycourses' element={userData?.role === "student" ? <MyEnrolledCourses /> : <Navigate to="/signup" />}
        />
        <Route
          path='/search' element={userData ? <SearchWIthAi /> : <Navigate to="/signup" />}
        />
        <Route
          path='/edit-quiz/:courseId'
          element={userData?.role === "educator" ? <ManageQuiz /> : <Navigate to="/signup" />}
        />
        <Route
          path='/manage-assignments/:courseId'
          element={userData?.role === "educator" ? <ManageAssignments /> : <Navigate to="/signup" />}
        />
        <Route
          path='/analytics/:courseId'
          element={userData?.role === "educator" ? <CourseAnalytics /> : <Navigate to="/signup" />}
        />
        <Route
          path='/manage-qa/:courseId'
          element={userData?.role === "educator" ? <ManageQA /> : <Navigate to="/signup" />}
        />
      </Routes>
      {userData && <AiFloatingChat />}
    </div>
  );
};

export default App;
