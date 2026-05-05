import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../constants";
import { toast } from "react-toastify";
import { FaArrowLeftLong, FaPlus, FaTrash } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";

const ManageQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Existing Quiz Data Load Karein
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true });
        setQuiz(res.data.quiz || []);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load quiz data");
      } finally {
        setFetching(false);
      }
    };
    if (courseId) fetchQuiz();
  }, [courseId]);

  // 2. Naya Sawal Add Karne ka Function
  const addQuestion = () => {
    setQuiz([...quiz, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  // 3. Sawal Remove Karne ka Function
  const removeQuestion = (index) => {
    const updatedQuiz = quiz.filter((_, i) => i !== index);
    setQuiz(updatedQuiz);
  };

  // 4. Save Quiz Function
  const handleSaveQuiz = async () => {
    if (quiz.length === 0) {
        return toast.error("Please add at least one question!");
    }

    const isValid = quiz.every(q => 
        q.question.trim() !== "" && 
        q.correctAnswer.trim() !== "" && 
        q.options.every(opt => opt.trim() !== "")
    );

    if (!isValid) {
        return toast.warning("Please fill all questions and options!");
    }

    setLoading(true);
    try {
        const res = await axios.post(
            `${serverUrl}/api/course/${courseId}/quiz`, 
            { quizArray: quiz }, 
            { withCredentials: true }
        );
        
        if (res.status === 200 || res.status === 201) {
            toast.success("Quiz Updated Successfully!");
            
            setQuiz(res.data.course.quiz || []);

            setTimeout(() => {
                navigate(`/editcourse/${courseId}`);
            }, 1500); 
        }
    } catch (err) {
        console.error("Save error:", err);
        toast.error(err.response?.data?.message || "Failed to save quiz");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className='min-h-screen pt-24 pb-12 px-4 md:px-8 relative overflow-hidden bg-gray-50 dark:bg-zinc-950'>
      <div className='bg-shape bg-purple-500 w-[400px] h-[400px] top-[-10%] right-[-10%] opacity-20'></div>
      <div className='bg-shape bg-indigo-500 w-[400px] h-[400px] bottom-[-10%] left-[-10%] opacity-20'></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/editcourse/${courseId}`)} 
              className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
            >
              <FaArrowLeftLong className="text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Manage Quiz Questions</h1>
          </div>
          <button 
            onClick={addQuestion}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            <FaPlus /> Add Question
          </button>
        </div>

        <div className="space-y-6">
          {quiz.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
              <p className="text-gray-500 dark:text-gray-400 font-medium">No questions added yet. Click 'Add Question' to start.</p>
            </div>
          ) : (
            quiz.map((q, qIndex) => (
              <div key={qIndex} className="glass-effect p-6 md:p-8 rounded-3xl border border-white/20 shadow-xl relative bg-white dark:bg-zinc-900/50">
                <button 
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-6 right-6 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                >
                  <FaTrash />
                </button>

                {/* Question Input - Optimized */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Question {qIndex + 1}</label>
                  <input 
                    type="text"
                    placeholder="Enter your question here..."
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 outline-none focus:border-indigo-500 dark:text-white transition-all text-lg"
                    value={q.question}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setQuiz(prev => {
                        const newQuiz = [...prev];
                        newQuiz[qIndex] = { ...newQuiz[qIndex], question: newValue };
                        return newQuiz;
                      });
                    }}
                  />
                </div>

                {/* Options Grid - Optimized */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="relative">
                      <input 
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        className="w-full h-12 px-5 rounded-xl border border-gray-100 dark:border-white/10 bg-white/60 dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all"
                        value={opt}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setQuiz(prev => {
                            const newQuiz = [...prev];
                            const newOptions = [...newQuiz[qIndex].options];
                            newOptions[oIndex] = newValue;
                            newQuiz[qIndex] = { ...newQuiz[qIndex], options: newOptions };
                            return newQuiz;
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer Selection */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                  <label className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">Select Correct Answer</label>
                  <select 
                    className="w-full h-12 px-5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-zinc-800 outline-none cursor-pointer dark:text-white focus:border-indigo-500"
                    value={q.correctAnswer}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setQuiz(prev => {
                        const newQuiz = [...prev];
                        newQuiz[qIndex] = { ...newQuiz[qIndex], correctAnswer: newValue };
                        return newQuiz;
                      });
                    }}
                  >
                    <option value="">-- Choose the right option --</option>
                    {q.options.map((opt, i) => (
                      <option key={i} value={opt}>{opt || `Empty Option ${i+1}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {quiz.length > 0 && (
          <div className="mt-10 flex justify-end">
            <button 
              onClick={handleSaveQuiz}
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <><ClipLoader size={20} color="currentColor" /> Saving...</> : "Save All Quiz Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuiz;