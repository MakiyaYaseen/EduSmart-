import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiRobot2Fill, RiSendPlane2Fill, RiCloseLine } from "react-icons/ri";
import { HiLightningBolt } from "react-icons/hi";
import axios from 'axios';
import { serverUrl } from '../constants';
import { useSelector } from 'react-redux';
import aiIcon from '../assets/ai.png';
import { useNavigate, useLocation } from 'react-router-dom';

const AiFloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I'm EduSmart-Bot. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const { userData } = useSelector(state => state.user);
    const location = useLocation();

    // Detect Course ID from URL
    const courseId = location.pathname.includes('/viewcourse/')
        ? location.pathname.split('/viewcourse/')[1]
        : location.pathname.includes('/viewlecture/')
            ? location.pathname.split('/viewlecture/')[1]
            : null;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await axios.post(`${serverUrl}/api/ai/chat`, {
                message: input,
                courseId: courseId
            }, { withCredentials: true });
            setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMsg = error.response?.data?.message || "I'm sorry, I'm having trouble connecting right now. Please try again later.";
            setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                                    <RiRobot2Fill className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm tracking-tight leading-none">EduSmart Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Always Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                                <RiCloseLine size={24} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/50 dark:bg-transparent">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-lg shadow-indigo-600/20'
                                        : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-white/5 shadow-sm'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl rounded-tl-sm border border-gray-100 dark:border-white/5 flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Input */}
                        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-zinc-900">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 rounded-2xl px-4 py-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your question..."
                                    className="bg-transparent flex-1 text-sm font-bold text-gray-900 dark:text-white outline-none h-10"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-30 shadow-lg shadow-indigo-600/20"
                                >
                                    <RiSendPlane2Fill />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">Powered by Gemini AI Engine</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-zinc-900 text-white' : 'bg-indigo-600 text-white'}`}
            >
                {isOpen ? <RiCloseLine size={32} /> : (
                    <div className="relative">
                        <RiRobot2Fill size={32} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-indigo-600 rounded-full"></div>
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default AiFloatingChat;
