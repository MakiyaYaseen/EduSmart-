import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../constants';
import { IoSend, IoClose, IoChatbubbleEllipses } from "react-icons/io5";
import { ClipLoader } from 'react-spinners';

const AIChatbot = ({ courseId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([{ role: 'bot', text: "Hello! I'm your AI tutor. How can I help you today?" }]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = { role: 'user', text: message };
        setChat(prev => [...prev, userMessage]);
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(`${serverUrl}/api/ai/chat`, { message, courseId }, { withCredentials: true });
            setChat(prev => [...prev, { role: 'bot', text: response.data.reply }]);
        } catch (error) {
            console.error(error);
            setChat(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Icon */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all text-white"
                >
                    <IoChatbubbleEllipses size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[380px] h-[550px] bg-white dark:bg-zinc-950 rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-white/10 glass-effect fixed bottom-24 right-6 animate-in slide-in-from-bottom duration-300">
                    {/* Header */}
                    <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <IoChatbubbleEllipses size={22} />
                            </div>
                            <div>
                                <span className="font-black text-lg block leading-none">AI Tutor</span>
                                <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online & Ready</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                            <IoClose size={24} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-gray-50/50 dark:bg-transparent">
                        {chat.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-tl-none border border-gray-100 dark:border-white/5'
                                    }`}>
                                    {msg.text}
                                    {msg.role === 'bot' && (
                                        <div className='mt-2 pt-2 border-t border-gray-200/50 dark:border-white/5 text-[10px] opacity-40 font-bold uppercase'>
                                            AI Assistant
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl rounded-tl-none border border-gray-100 dark:border-white/5">
                                    <div className='flex gap-1'>
                                        <div className='w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce'></div>
                                        <div className='w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75'></div>
                                        <div className='w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150'></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    <div className="p-5 bg-white dark:bg-transparent border-t dark:border-white/10">
                        <div className='flex items-center gap-3 bg-gray-100 dark:bg-zinc-900/50 rounded-2xl p-2 px-4 border border-transparent focus-within:border-indigo-500/50 transition-all'>
                            <input
                                type="text"
                                className="flex-1 bg-transparent py-2 text-sm outline-none dark:text-white font-medium"
                                placeholder="Write your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || loading}
                                className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 transition-all"
                            >
                                <IoSend size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatbot;
