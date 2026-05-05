import React, { useState, useMemo } from 'react';
import { serverUrl } from '../constants';
import Nav from '../component/Nav';
import { FaArrowLeftLong } from "react-icons/fa6";
import aiIcon from '../assets/ai.png';
import { RiMicFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import startSoundFile from '../assets/start.mp3';

const SearchWIthAi = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false);
  const [searching, setSearching] = useState(false);

  const audio = useMemo(() => typeof Audio !== 'undefined' ? new Audio(startSoundFile) : null, []);

  const recognition = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return SpeechRecognition ? new SpeechRecognition() : null;
  }, []);

  function speak(message) {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      let utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }

  const handleSearch = () => {
    if (!recognition) {
      toast.error("Speech recognition is not supported in this browser. Please try Chrome.");
      return;
    }

    try {
      setListening(true);
      if (audio) audio.play().catch(() => { });
      recognition.start();
    } catch (e) {
      console.log("Recognition error:", e);
      setListening(false);
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      setListening(false);
      handleRecommendation(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      toast.error("Vocal search failed. Please try again or type manually.");
    };

    recognition.onend = () => setListening(false);
  };

  const handleRecommendation = async (query) => {
    if (!query.trim()) return;

    setSearching(true);
    setRecommendations([]);

    try {
      const result = await axios.post(`${serverUrl}/api/course/search`, { input: query }, { withCredentials: true });

      if (result.data && result.data.length > 0) {
        setRecommendations(result.data);
        speak(`I found ${result.data.length} courses that might interest you.`);
      } else {
        const chatRes = await axios.post(`${serverUrl}/api/ai/chat`, { message: query }, { withCredentials: true });
        const aiResponse = chatRes.data.reply;
        setRecommendations([{ isAiResponse: true, content: aiResponse }]);
        speak("I couldn't find a direct course match, but here is some information on that topic.");
      }
    } catch (error) {
      console.error("Search Error:", error);
      const errorMsg = error.response?.data?.message || "Search failed. Please check your connection.";
      toast.error(errorMsg);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className='min-h-screen w-full relative flex flex-col items-center bg-gray-50 dark:bg-zinc-950'>
      <Nav />
      <div className='w-full pt-32 pb-20 px-4 flex flex-col items-center'>
        {/* Background Shapes */}
        <div className='bg-shape bg-indigo-500 w-[600px] h-[600px] top-[-10%] right-[-20%] opacity-20'></div>
        <div className='bg-shape bg-teal-500 w-[500px] h-[500px] bottom-[10%] left-[-10%] opacity-20'></div>

        <div className='w-full max-w-5xl relative z-10 flex flex-col items-center'>

          {/* Back Button */}
          <div
            onClick={() => navigate("/")}
            className='absolute -top-12 left-0 md:bg-white/50 dark:bg-zinc-900/50 p-3 rounded-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-sm border border-white/20 backdrop-blur-md z-20 group'
          >
            <FaArrowLeftLong className='text-gray-700 dark:text-zinc-300 group-hover:text-indigo-600 transition-colors' />
          </div>

          {/* Search Header Container */}
          <div className='glass-effect w-full p-8 md:p-14 rounded-[48px] border-white/30 shadow-2xl relative mb-12 flex flex-col items-center bg-white/60 dark:bg-zinc-900/60 transition-all'>

            <div className='mb-10 text-center space-y-4'>
              <div className='inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest'>
                <span className='w-2 h-2 bg-indigo-500 rounded-full animate-ping'></span>
                AI Powered Search
              </div>
              <h1 className='text-4xl sm:text-6xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-4 tracking-tighter text-center'>
                Find your <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600'>Future</span>
              </h1>
              <p className='text-gray-500 dark:text-zinc-400 font-medium max-w-lg mx-auto text-center'>
                Describe what you want to learn in plain language, or just speak to me!
              </p>
            </div>

            <div className='flex items-center bg-white dark:bg-zinc-800 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-3xl px-4 py-3 border-2 border-transparent focus-within:border-indigo-500/50 transition-all group'>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRecommendation(input)}
                className='grow h-14 pl-6 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-xl font-bold'
                placeholder="e.g. 'I want to build mobile apps'"
              />
              <div className='flex items-center gap-3 shrink-0'>
                <button
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${listening ? 'bg-red-500 animate-pulse scale-110 text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-600'}`}
                  onClick={handleSearch}
                  title="Speak to Search"
                >
                  <RiMicFill className='w-7 h-7' />
                </button>

                <button
                  disabled={!input.trim() || searching}
                  onClick={() => handleRecommendation(input)}
                  className='w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 hover:scale-110 active:scale-95 disabled:opacity-30 transition-all shadow-indigo-600/20 shadow-xl'
                >
                  {searching ? <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div> : <img src={aiIcon} alt="Ai" className='w-8 h-8' />}
                </button>
              </div>
            </div>

            {listening && <p className='mt-6 text-indigo-600 dark:text-indigo-400 font-black animate-pulse tracking-widest uppercase text-xs'>Listening Voice Query...</p>}
          </div>

          {/* Results Section */}
          <div className='w-full'>
            {searching ? (
              <div className='flex flex-col items-center justify-center py-20 gap-4 opacity-70'>
                <div className='w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
                <p className='text-indigo-600 dark:text-indigo-400 font-black uppercase text-sm tracking-widest'>AI is finding best courses...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className='w-full'>
                {recommendations[0]?.isAiResponse ? (
                  <div className='max-w-4xl mx-auto'>
                    <h2 className='text-3xl font-black mb-10 text-gray-900 dark:text-white text-center tracking-tight'>
                      AI <span className='text-indigo-500'>Consultant</span> Response
                    </h2>
                    <div className='glass-effect rounded-[40px] p-8 md:p-12 border-white/20 bg-white/40 dark:bg-zinc-900/40 shadow-2xl relative overflow-hidden'>
                      <div className='absolute top-0 right-0 p-8 opacity-10'>
                        <img src={aiIcon} className='w-32 h-32' alt="" />
                      </div>
                      <div className='prose prose-indigo dark:prose-invert max-w-none relative z-10'>
                        <p className='text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium whitespace-pre-wrap'>
                          {recommendations[0].content}
                        </p>
                      </div>
                      <div className='mt-10 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-6'>
                        <button
                          onClick={() => navigate("/allcourses")}
                          className='px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all'
                        >
                          Browse All Courses
                        </button>
                        <p className='text-sm text-gray-500 font-bold uppercase tracking-widest'>Still have questions? Ask me anything!</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className='text-3xl font-black mb-10 text-gray-900 dark:text-white text-center tracking-tight'>
                      Top AI Matches <span className='text-indigo-500'>({recommendations.length})</span>
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {recommendations.map((course, index) => (
                        <div
                          key={index}
                          className='glass-effect rounded-[40px] p-8 border-white/20 shadow-xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:-translate-y-3 transition-all duration-500 bg-white/40 dark:bg-zinc-900/40 cursor-pointer group flex flex-col h-full'
                          onClick={() => navigate(`/viewcourse/${course._id}`)}
                        >
                          <div className='mb-6 overflow-hidden rounded-2xl aspect-[16/9]'>
                            <img src={course.thumbnail} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' alt="" />
                          </div>
                          <div className='space-y-4 flex-1'>
                            <span className='inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-500/10'>
                              {course.category}
                            </span>
                            <h2 className='text-xl font-black text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                              {course.title}
                            </h2>
                          </div>
                          <div className='mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between'>
                            <span className='font-black text-gray-900 dark:text-white text-lg'>PKR {course.price}</span>
                            <div className='w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-all'>
                              <FaArrowLeftLong className='rotate-180' />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : !listening && input && (
              <div className='glass-effect rounded-[40px] p-16 text-center border-white/20 bg-white/30 dark:bg-white/5'>
                <div className='w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6'>
                  <img src={aiIcon} className='w-10 h-10 grayscale opacity-40' alt="" />
                </div>
                <h3 className='text-2xl font-black text-gray-400 mb-2'>No Direct Matches Found</h3>
                <p className='text-gray-500 dark:text-zinc-500 font-medium'>Try different keywords or browse our catalog.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWIthAi;
