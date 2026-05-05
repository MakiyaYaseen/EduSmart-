import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { serverUrl } from '../constants'
import { FaPlayCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import AIChatbot from '../component/AIChatbot.jsx';
import { IoRibbonOutline, IoDocumentAttachOutline, IoCloudUploadOutline, IoClose, IoListOutline } from 'react-icons/io5'
import CertificateModal from '../component/CertificateModal';
import DiscussionBoard from '../component/DiscussionBoard';

const ViewLectures = () => {
  const { courseId } = useParams()
  const { courseData } = useSelector(state => state.course)
  const selectedCourseRedux = courseData?.find((course) => course._id === courseId)
  const [course, setCourse] = useState(selectedCourseRedux || null)
  const [creatorData, setCreatorData] = useState(null)
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [courseProgress, setCourseProgress] = useState({ completedLectures: [], progressPercentage: 0 })
  const [markingComplete, setMarkingComplete] = useState(false)
  const [canMarkComplete, setCanMarkComplete] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certData, setCertData] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      setLoading(true); // Refresh hote hi loading shuru
      try {
        const courseRes = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true });
        const progressRes = await axios.get(`${serverUrl}/api/progress/course/${courseId}?t=${new Date().getTime()}`, { withCredentials: true });

        setCourseProgress(progressRes.data);
        setCourse(courseRes.data);
        if (courseRes.data?.lectures?.length > 0) {
          const lastId = progressRes.data.lastWatchedLecture;
          const initialLecture = courseRes.data.lectures.find(l => l._id === lastId) || courseRes.data.lectures[0];
          setSelectedLecture(initialLecture);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourseAndProgress();
  }, [courseId]);
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/assignment/course/${courseId}`, { withCredentials: true })
        setAssignments(result.data)
      } catch (error) {
        console.log("Assignments fetch error:", error)
      }
    }
    if (courseId) fetchAssignments()
  }, [courseId])
  useEffect(() => {
    const handleBeforeUnload = () => {
      const video = document.querySelector('video');
      // Adding a safety check to not save progress if marking complete is in process or done
      if (video && selectedLecture && !isLectureCompleted(selectedLecture._id) && !canMarkComplete) {
        persistProgress(video.currentTime, maxWatchedTime);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Also persist on component unmount
      const video = document.querySelector('video');
      if (video && selectedLecture && !isLectureCompleted(selectedLecture._id) && !canMarkComplete) {
        persistProgress(video.currentTime, maxWatchedTime);
      }
    };
  }, [selectedLecture, maxWatchedTime, courseProgress, canMarkComplete]);
  useEffect(() => {
    const handleCreator = async () => {
      const creatorId = course?.creator?._id || course?.creator;
      if (creatorId) {
        try {
          const result = await axios.post(serverUrl + "/api/course/creator", { userId: creatorId }, { withCredentials: true })
          setCreatorData(result.data)
        } catch (error) { console.log(error) }
      }
    }
    handleCreator()
  }, [courseId, course])
  useEffect(() => {
    if (!selectedLecture && course?.lectures?.length > 0) {
      setSelectedLecture(course.lectures[0])
    }
  }, [course])
  useEffect(() => {
    if (!selectedLecture || !courseProgress) return;
    const completed = isLectureCompleted(selectedLecture?._id);
    if (completed) {
      setCanMarkComplete(true);
      setMaxWatchedTime(999999);
      setVideoProgress(100);
    } else {
      const watchData = courseProgress?.lectureWatchData?.find(ld =>
        (ld.lectureId?._id || ld.lectureId)?.toString() === selectedLecture?._id?.toString()
      );
      const initialMax = watchData?.maxTime || 0;
      setMaxWatchedTime(initialMax);
      setVideoProgress(0);
    }
  }, [selectedLecture, courseProgress]);
  const onVideoLoad = (e) => {
    if (!selectedLecture || !courseProgress) return;
    if (isLectureCompleted(selectedLecture?._id)) {
      setMaxWatchedTime(999999);
      setCanMarkComplete(true);
      setVideoProgress(100);
      return;
    }
    const duration = e.target.duration;
    const watchData = courseProgress?.lectureWatchData?.find(
      ld => (ld.lectureId?._id || ld.lectureId)?.toString() === selectedLecture._id?.toString()
    );
    if (watchData?.lastTime) {
      e.target.currentTime = watchData.lastTime;
      setMaxWatchedTime(watchData.maxTime || watchData.lastTime);
    }
    if (isLectureCompleted(selectedLecture._id)) {
      setMaxWatchedTime(duration);
      setCanMarkComplete(true);
    }
    else if (watchData?.maxTime && duration) {
      const savedPercentage = (watchData.maxTime / duration) * 100;
      if (savedPercentage >= 90) {
        setCanMarkComplete(true);
      }
    }
  }
  const persistProgress = (currentTime, maxTime) => {
    // Stop syncing progress if the lecture is already officially completed
    if (!selectedLecture || isLectureCompleted(selectedLecture._id) || canMarkComplete) return;
    try {
      fetch(`${serverUrl}/api/progress/update-video-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, lectureId: selectedLecture._id, currentTime, maxTime }),
        keepalive: true,
        credentials: 'include'
      });
    } catch (error) {
      console.error("Failed to persist progress", error);
    }
  }
  const handleSeeking = (e) => {
    if (e.target.currentTime > maxWatchedTime) {
      e.target.currentTime = maxWatchedTime;
      toast.info("Seeking restricted. Please watch the complete lecture.");
    }
  };
  const markLectureComplete = async () => {
    if (!selectedLecture) return
    setMarkingComplete(true)
    try {
      const res = await axios.post(`${serverUrl}/api/progress/mark-complete`,
        { courseId, lectureId: selectedLecture._id, playedPercentage: videoProgress },
        { withCredentials: true }
      )
      setMaxWatchedTime(999999);
      setCanMarkComplete(true);
      const newProgress = res.data.courseProgress;
      setCourseProgress(newProgress)

      if (newProgress.progressPercentage === 100) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        toast.success("Congratulations! You've finished all lectures!");
      } else {
        toast.success("Lecture marked as complete!");
      }
      const currentIndex = course?.lectures?.findIndex(l => l._id === selectedLecture._id)
      if (currentIndex !== -1 && currentIndex < course.lectures.length - 1) {
        setSelectedLecture(course.lectures[currentIndex + 1])
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to mark complete")
    }
    finally { setMarkingComplete(false) }
  }
  const handleQuizFinish = async (finalScore) => {
    try {
      const percentage = Math.round((finalScore / course.quiz.length) * 100);
      const res = await axios.post(`${serverUrl}/api/progress/submit-quiz`,
        { courseId, score: percentage },
        { withCredentials: true }
      );
      setCourseProgress(res.data.courseProgress);
      toast.success(`Quiz submitted! Your score: ${percentage}%`);
      setShowResult(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quiz score");
    }
  };
  const handleClaimCertificate = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/certificate/${courseId}`, { withCredentials: true });
      setCertData(res.data);
      setShowCertModal(true);
      setCourseProgress(prev => ({ ...prev, certificateIssued: true }));
      toast.success("Professional Certificate Generated!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Qualification not met! Please ensure 100% completion.");
    }
  };
  const handleAssignmentSubmit = async () => {
    if (!submissionContent.trim() && !submissionFile) {
      return toast.error("Please add some content or a file to your submission");
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("assignmentId", selectedAssignment._id);
      formData.append("content", submissionContent);
      if (submissionFile) {
        formData.append("file", submissionFile);
      }
      await axios.post(`${serverUrl}/api/assignment/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      toast.success("Assignment submitted successfully!");
      setShowSubmitModal(false);
      setSubmissionContent("");
      setSubmissionFile(null);
      const result = await axios.get(`${serverUrl}/api/assignment/course/${courseId}`, { withCredentials: true })
      setAssignments(result.data)
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };
  const isLectureCompleted = (lectureId) => {
    if (!courseProgress?.completedLectures) return false;
    const targetId = lectureId?.toString();
    return courseProgress.completedLectures.some(id => {
      const idStr = (id?._id || id)?.toString();
      return idStr === targetId;
    });
  };
  if (!course || !selectedLecture || !courseProgress) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950'>
        <div className='w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4'></div>
        <p className='text-gray-500 font-bold animate-pulse uppercase tracking-[3px] text-xs'>
          Syncing Progress...
        </p>
      </div>
    );
  }
  return (
    <div className='min-h-screen pt-20 pb-10 px-4 md:px-8 relative overflow-hidden flex flex-col md:flex-row gap-6'>
      <div className='bg-shape bg-indigo-500 w-[500px] h-[500px] top-[-10%] right-[-20%] opacity-30'></div>
      <div className='bg-shape bg-purple-500 w-[500px] h-[500px] bottom-[10%] left-[-10%] opacity-30'></div>
      <div className='w-full md:w-2/3 flex flex-col gap-6 relative z-10'>
        <div className='glass-effect p-6 rounded-[32px] border-white/20 shadow-2xl bg-white/40 dark:bg-black/40'>
          <div className='mb-6'>
            <h2 className='text-xl md:text-2xl font-black flex items-center gap-4 text-gray-900 dark:text-white'>
              <div onClick={() => navigate("/")} className='w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 flex items-center justify-center cursor-pointer shadow-sm'><FaArrowLeftLong /></div>
              <span className='line-clamp-1'>{course?.title}</span>
            </h2>
          </div>

          <div className='aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-gray-800 transition-all hover:scale-[1.01]'>
            {selectedLecture?.videoUrl ? (
              <video
                key={selectedLecture?._id}
                className='w-full h-full object-cover'
                src={selectedLecture?.videoUrl}
                controls
                onLoadedData={onVideoLoad}
                onSeeking={(e) => {
                  if (!isLectureCompleted(selectedLecture?._id) && e.target.currentTime > maxWatchedTime + 2) {
                    e.target.currentTime = maxWatchedTime;
                    toast.info("Please watch the video without skipping!");
                  }
                }}
                onPause={(e) => {
                  if (!isLectureCompleted(selectedLecture?._id) && !canMarkComplete) {
                    persistProgress(e.target.currentTime, maxWatchedTime)
                  }
                }}
                onTimeUpdate={(e) => {
                  const current = e.target.currentTime;
                  const duration = e.target.duration;
                  // Extremely crucial check: DO NOT update or persist anything if marking is complete
                  if (isLectureCompleted(selectedLecture?._id) || canMarkComplete) {
                    // We just update the frontend UI bar so it looks full
                    setVideoProgress((current / duration) * 100);
                    return;
                  }
                  if (current > maxWatchedTime + 2) {
                    e.target.currentTime = maxWatchedTime;
                    return;
                  }
                  if (current > maxWatchedTime) {
                    setMaxWatchedTime(current);
                  }
                  const progress = (current / duration) * 100;
                  setVideoProgress(progress);
                  if (Math.floor(current) % 10 === 0 && Math.floor(current) !== 0) {
                    if (e.target.lastSavedSecond !== Math.floor(current)) {
                      e.target.lastSavedSecond = Math.floor(current);
                      persistProgress(current, maxWatchedTime);
                    }
                  }
                  if (progress >= 90 && !canMarkComplete) {
                    setCanMarkComplete(true);
                    toast.success("90% complete! Now you can mark it as complete.");
                  }
                }} />) : (
              <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                <FaPlayCircle className='text-6xl mb-4 animate-pulse' />
                <span>{selectedLecture ? "This lecture doesn't have a video yet." : "Select a lecture to begin"}</span>
              </div>
            )}
          </div>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-6'>
            <h2 className='text-2xl font-black dark:text-white'>{selectedLecture?.lectureTitle}</h2>
            {isLectureCompleted(selectedLecture?._id) ? (
              <div className='px-8 py-3 bg-green-500/10 text-green-600 rounded-2xl font-bold border border-green-500/20'>
                ✓ Activity Completed
              </div>
            ) : (
              <button
                onClick={markLectureComplete}
                disabled={markingComplete || !canMarkComplete}
                className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-xl ${canMarkComplete
                  ? 'bg-green-600 text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {markingComplete ? "Marking..." : "Mark as Complete"}
              </button>
            )}
          </div>
          <div className='bg-indigo-500/5 dark:bg-indigo-500/10 rounded-3xl p-6 border border-indigo-500/10'>
            <div className='flex justify-between mb-3 text-indigo-600 dark:text-indigo-400'>
              <span className='text-sm font-black uppercase tracking-widest'>Your Progress</span>
              <span className='text-sm font-black'>{courseProgress?.progressPercentage || 0}% Complete</span>
            </div>
            <div className='h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden'>
              <div
                className='h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                style={{ width: `${courseProgress?.progressPercentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className='glass-effect p-8 rounded-[40px] border-white/20 shadow-xl bg-white/50 dark:bg-black/40'>
          <h2 className='text-2xl font-black mb-8 dark:text-white flex items-center gap-3'>
            <div className='w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <IoDocumentAttachOutline size={22} />
            </div>
            Assignments
          </h2>
          {assignments.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {assignments.map((assignment, index) => (
                <div key={index} className='group p-6 rounded-[32px] border border-gray-100 dark:border-white/10 bg-white dark:bg-zinc-900/50 flex flex-col gap-4 transition-all hover:border-indigo-500/50 hover:shadow-2xl'>
                  <div className='flex justify-between items-start'>
                    <div className='space-y-1'>
                      <h3 className='font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors'>{assignment.title}</h3>
                      <p className='text-xs text-gray-500 font-medium leading-relaxed'>{assignment.description}</p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between mt-2 pt-4 border-t border-gray-50 dark:border-white/5'>
                    <div className='bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-gray-400'>
                      Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </div>
                    {courseProgress?.progressPercentage === 100 ? (
                      assignment.isSubmitted ? (
                        <div className='flex flex-col gap-2 items-end'>
                          <div className='bg-green-500/10 text-green-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 border border-green-500/20'>
                            ✅ {assignment.submissionDetails?.grade ? "Graded" : "Submitted"}
                          </div>
                          {assignment.submissionDetails?.grade && (
                            <div className='bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 max-w-[200px]'>
                              <p className='text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase mb-1'>Grade: {assignment.submissionDetails.grade}</p>
                              {assignment.submissionDetails.feedback && (
                                <p className='text-[10px] text-gray-500 italic line-clamp-2'>"{assignment.submissionDetails.feedback}"</p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowSubmitModal(true);
                          }}
                          className='px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/20'
                        >
                          Submit Now
                        </button>
                      )
                    ) : (
                      <div className='text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase flex items-center gap-1'>
                        Locked: Finish Videos First
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-16 text-gray-400 bg-gray-50/50 dark:bg-white/5 rounded-[32px] border-2 border-dashed border-gray-200 dark:border-white/10'>
              <div className='mb-4 flex justify-center'>
                <IoDocumentAttachOutline size={48} className='opacity-20' />
              </div>
              <p className='font-bold uppercase text-xs tracking-[2px]'>No Active Assignments</p>
            </div>
          )}
        </div>
        <div className='glass-effect p-10 rounded-[40px] border-indigo-500/20 shadow-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-8'>
            <div className='text-center lg:text-left'>
              <h2 className='text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2'>Unlock Your Certification</h2>
              <p className='text-gray-500 dark:text-gray-400 font-medium max-w-md'>Complete all lectures and the final assessment to receive your AI-verified professional certificate.</p>
            </div>
            <div className='flex flex-wrap justify-center gap-4'>
              <button
                disabled={courseProgress?.progressPercentage < 100 || courseProgress?.quizCompleted}
                onClick={() => setQuizStarted(true)}
                className={`px-10 py-5 rounded-3xl font-black transition-all shadow-2xl ${courseProgress?.progressPercentage === 100 && !courseProgress?.quizCompleted ? "bg-indigo-600 text-white hover:scale-105 active:scale-95" : "bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"}`} >
                {courseProgress?.quizCompleted ? `✅ Quiz Done (${courseProgress.quizScore}%)` : "📝 Final Assessment"}
              </button>
              {courseProgress?.progressPercentage === 100 && courseProgress?.quizCompleted && (
                <button
                  disabled={courseProgress?.certificateIssued || (assignments.length > 0 && assignments.some(a => !a.isSubmitted || a.submissionDetails?.grade === "Pending"))}
                  onClick={handleClaimCertificate}
                  className={`px-10 py-5 rounded-3xl font-black transition-all shadow-2xl flex items-center gap-3 border-b-4 ${(courseProgress?.certificateIssued || (assignments.length > 0 && assignments.some(a => !a.isSubmitted || a.submissionDetails?.grade === "Pending"))) ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed border-gray-400" : "bg-amber-500 text-white hover:scale-105 active:scale-95 border-amber-700"}`}>
                  <IoRibbonOutline size={24} /> 
                  {courseProgress?.certificateIssued 
                    ? "Certificate Claimed" 
                    : (assignments.length > 0 && assignments.some(a => !a.isSubmitted)) 
                      ? "Pending Assignments" 
                      : (assignments.length > 0 && assignments.some(a => a.submissionDetails?.grade === "Pending"))
                        ? "Pending Grading"
                        : "Claim Certificate"}
                </button>
              )}
            </div>
          </div>
          <div className='mt-8 pt-6 border-t border-indigo-100 dark:border-white/5 flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <div className={`w-2 h-2 rounded-full ${courseProgress?.progressPercentage < 100 ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
              <p className='text-[10px] font-black uppercase tracking-[3px] text-gray-500'>
                Videos: {courseProgress?.progressPercentage < 100 ? 'In Progress' : 'Completed'}
              </p>
            </div>
            {courseProgress?.progressPercentage === 100 && (
              <div className='flex items-center gap-2'>
                <div className={`w-2 h-2 rounded-full ${!courseProgress?.quizCompleted ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                <p className='text-[10px] font-black uppercase tracking-[3px] text-gray-500'>
                  Quiz: {!courseProgress?.quizCompleted ? 'Pending' : 'Completed'}
                </p>
              </div>
            )}
            {courseProgress?.finalScore !== null && courseProgress?.finalScore !== undefined && (
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.8)]'></div>
                <p className='text-[10px] font-black uppercase tracking-[3px] text-indigo-600'>
                  Final Grade: {courseProgress?.finalScore}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Discussion Board Integration */}
        {selectedLecture && (
          <DiscussionBoard courseId={courseId} lectureId={selectedLecture._id} />
        )}

      </div>
      {showSubmitModal && (
        <div className='fixed inset-0 z-[110] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6'>
          <div className='bg-white dark:bg-zinc-950 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-white/20 glass-effect p-8 flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-2xl font-black dark:text-white'>Submit Assignment</h3>
                <p className='text-sm text-indigo-500 font-bold uppercase tracking-widest'>{selectedAssignment?.title}</p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className='w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 transition-colors'
              > ✕</button>
            </div>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-black dark:text-gray-300 flex items-center gap-2'>
                  <IoDocumentAttachOutline /> Assignment Content
                </label>
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Explain your solution or paste links to your project/files..."
                  className='w-full h-32 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-3xl p-6 text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium' />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-black dark:text-gray-300 flex items-center gap-2'>
                  <IoCloudUploadOutline /> Upload Document (PDF)
                </label>
                <div className='relative'>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSubmissionFile(e.target.files[0])}
                    className='hidden'
                    id="assignment-file" />
                  <label
                    htmlFor="assignment-file"
                    className='w-full py-4 px-6 bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-all' >
                    <span className='text-xs text-gray-500 font-bold'>
                      {submissionFile ? submissionFile.name : "Choose PDF file..."}
                    </span>
                    <div className='bg-indigo-600 text-white p-2 rounded-lg'>
                      <IoCloudUploadOutline size={18} />
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <button
              disabled={isSubmitting || (!submissionContent.trim() && !submissionFile)}
              onClick={handleAssignmentSubmit}
              className='w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50'>
              {isSubmitting ? "Uploading Strategy..." : "Confirm Submission"}
            </button>
          </div>
        </div>
      )}
      <div className={`
        w-full md:w-1/3 flex flex-col gap-6 relative z-[60]
        fixed md:relative inset-y-0 right-0 md:inset-auto
        transform ${showMobileSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        transition-transform duration-300 ease-in-out
        bg-white dark:bg-zinc-950 md:bg-transparent
        p-6 md:p-0 shadow-2xl md:shadow-none
      `}>
        <div className='flex justify-between items-center mb-6 md:hidden'>
          <h2 className='text-xl font-black dark:text-white'>Course Content</h2>
          <button onClick={() => setShowMobileSidebar(false)} className='p-2 bg-gray-100 dark:bg-white/5 rounded-xl'><IoClose size={24} /></button>
        </div>
        <div className='glass-effect p-6 rounded-[32px] bg-white/40 dark:bg-black/40 shadow-2xl h-full md:h-auto overflow-hidden flex flex-col'>
          <h2 className='text-xl font-black mb-6 dark:text-white hidden md:block'>Course Content</h2>
          <div className='flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pr-2'>
            {course?.lectures?.map((lecture, index) => (
              <button key={index}
                onClick={() => {
                  setSelectedLecture(lecture);
                  if (window.innerWidth < 768) setShowMobileSidebar(false);
                }}
                className={`p-4 rounded-xl border transition-all text-left flex justify-between items-center ${selectedLecture?._id === lecture._id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]' : 'bg-white/50 dark:bg-white/5 border-transparent hover:border-indigo-500/20'}`} >
                <div>
                  <span className={`text-[10px] uppercase font-bold ${selectedLecture?._id === lecture._id ? 'text-indigo-200' : 'opacity-60'}`}>Lecture {index + 1}</span>
                  <h3 className='text-sm font-bold line-clamp-1'>{lecture.lectureTitle}</h3>
                </div>
                {isLectureCompleted(lecture._id) && <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${selectedLecture?._id === lecture._id ? 'bg-white text-indigo-600' : 'bg-green-500 text-white'}`}>✓</div>}
              </button>
            ))}
          </div>
          {creatorData && (
            <div className='mt-8 pt-6 border-t border-gray-200 dark:border-white/10'>
              <h3 className='text-xs font-black text-gray-400 uppercase mb-4'>Instructor</h3>
              <div className='flex items-center gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-2xl'>
                <img src={creatorData?.photoUrl} className='w-12 h-12 rounded-full border-2 border-white object-cover' alt="" />
                <div className='overflow-hidden text-left'>
                  <h2 className='text-sm font-black truncate dark:text-white'>{creatorData?.name}</h2>
                  <p className='text-xs text-gray-500 truncate'>{creatorData?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => setShowMobileSidebar(true)}
        className='md:hidden fixed bottom-6 left-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center z-[50] hover:scale-110 active:scale-95 transition-all'>
        <IoListOutline size={28} />
      </button>
      {showMobileSidebar && (
        <div onClick={() => setShowMobileSidebar(false)} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden'></div>
      )}
      {quizStarted && (
        <div className='fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4'>
          <div className='bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative'>
            {!showResult ? (
              <div className='p-8'>
                <div className='flex justify-between items-center mb-8'>
                  <span className='text-xs font-black uppercase tracking-widest text-indigo-500'>
                    Question {currentQuestionIndex + 1} of {course?.quiz?.length || 0}
                  </span>
                  <button onClick={() => setQuizStarted(false)} className='text-gray-400 hover:text-red-500'>✕ Close</button>
                </div>

                <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8'>
                  {course?.quiz?.[currentQuestionIndex]?.question || "No Question Found"}
                </h2>
                <div className='grid grid-cols-1 gap-4 mb-8'>
                  {course?.quiz?.[currentQuestionIndex]?.options?.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(option)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${selectedAnswer === option
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                        : 'border-gray-100 dark:border-white/5 hover:border-indigo-200 dark:text-gray-300'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedAnswer}
                  onClick={() => {
                    if (selectedAnswer === course.quiz[currentQuestionIndex].correctAnswer) {
                      setScore(score + 1);
                    }
                    if (currentQuestionIndex + 1 < course.quiz.length) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                      setSelectedAnswer(null);
                    } else {
                      const finalScore = selectedAnswer === course.quiz[currentQuestionIndex].correctAnswer ? score + 1 : score;
                      handleQuizFinish(finalScore);
                    }
                  }}
                  className='w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 hover:bg-indigo-700 transition-all'
                >
                  {currentQuestionIndex + 1 === course?.quiz?.length ? "Finish Quiz" : "Next Question"}
                </button>
              </div>
            ) : (
              <div className='p-12 text-center'>
                <div className='text-6xl mb-4'>🎓</div>
                <h2 className='text-3xl font-black text-gray-900 dark:text-white mb-2'>Quiz Completed!</h2>
                <p className='text-gray-500 mb-8'>You scored <span className='text-indigo-600 font-black'>{score}</span> out of <span className='font-bold'>{course?.quiz?.length}</span></p>
                <button
                  onClick={() => {
                    setQuizStarted(false);
                    setShowResult(false);
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setSelectedAnswer(null);
                  }}
                  className='px-10 py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold hover:scale-105 transition-all'
                >
                  Back to Course
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        data={certData}
      />
    </div>
  )
}

export default ViewLectures