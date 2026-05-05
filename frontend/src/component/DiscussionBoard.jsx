import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../constants';
import { toast } from 'react-toastify';
import { IoChatbubbleEllipsesOutline, IoSend, IoPersonCircleOutline } from 'react-icons/io5';

const DiscussionBoard = ({ courseId, lectureId }) => {
    const [discussions, setDiscussions] = useState([]);
    const [newQuestionTitle, setNewQuestionTitle] = useState('');
    const [newQuestionText, setNewQuestionText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetchDiscussions();
    }, [courseId]);

    const fetchDiscussions = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/discussion/course/${courseId}`, { withCredentials: true });
            setDiscussions(res.data);
        } catch (error) {
            console.error("Failed to fetch discussions", error);
        }
    };

    const handlePostQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestionTitle.trim() || !newQuestionText.trim()) return toast.error("Title and question cannot be empty");

        setIsSubmitting(true);
        try {
            const res = await axios.post(`${serverUrl}/api/discussion`, {
                courseId,
                lectureId,
                title: newQuestionTitle,
                text: newQuestionText
            }, { withCredentials: true });

            setDiscussions([res.data, ...discussions]);
            setNewQuestionTitle('');
            setNewQuestionText('');
            toast.success("Question posted successfully!");
        } catch (error) {
            toast.error("Failed to post question");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePostReply = async (discussionId) => {
        if (!replyText.trim()) return toast.error("Reply cannot be empty");

        try {
            const res = await axios.post(`${serverUrl}/api/discussion/${discussionId}/reply`, {
                text: replyText
            }, { withCredentials: true });

            setDiscussions(discussions.map(d => d._id === discussionId ? res.data : d));
            setReplyingTo(null);
            setReplyText('');
            toast.success("Reply added!");
        } catch (error) {
            toast.error("Failed to post reply");
        }
    };

    return (
        <div className='w-full glass-effect p-6 md:p-8 rounded-[40px] border border-white/20 shadow-xl bg-white/50 dark:bg-black/40 mt-8'>
            <div className='flex items-center gap-3 mb-8'>
                <div className='w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg'>
                    <IoChatbubbleEllipsesOutline size={24} />
                </div>
                <div>
                    <h2 className='text-2xl font-black dark:text-white'>Course Q&A</h2>
                    <p className='text-sm text-gray-500 font-bold'>Ask questions and discuss with your peers and instructor.</p>
                </div>
            </div>

            {/* Ask Question Form */}
            <form onSubmit={handlePostQuestion} className='mb-10 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm'>
                <h3 className='font-bold text-gray-900 dark:text-white mb-4'>Ask a New Question</h3>
                <input
                    type="text"
                    placeholder="Question Title (e.g., Issue with React Hooks)"
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    className='w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 mb-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white'
                />
                <textarea
                    placeholder="Describe your question in detail..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className='w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 mb-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] custom-scrollbar dark:text-white'
                />
                <div className='flex justify-end'>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className='px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50'
                    >
                        {isSubmitting ? "Posting..." : <><IoSend /> Post Question</>}
                    </button>
                </div>
            </form>

            {/* Discussions List */}
            <div className='space-y-6'>
                {discussions.length === 0 ? (
                    <div className='text-center py-10 text-gray-400'>
                        <IoChatbubbleEllipsesOutline size={48} className='mx-auto mb-3 opacity-20' />
                        <p className='font-bold uppercase tracking-widest text-xs'>No questions yet. Be the first to ask!</p>
                    </div>
                ) : (
                    discussions.map(discussion => (
                        <div key={discussion._id} className='bg-white/60 dark:bg-zinc-900/60 rounded-[28px] p-6 border border-gray-100 dark:border-white/5'>
                            <div className='flex gap-4'>
                                {discussion.userId?.photoUrl ? (
                                    <img src={discussion.userId.photoUrl} alt="avatar" className='w-10 h-10 rounded-full object-cover shadow-sm' />
                                ) : (
                                    <IoPersonCircleOutline size={40} className='text-gray-400' />
                                )}
                                <div className='flex-1'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h4 className='font-black text-gray-900 dark:text-white text-lg'>{discussion.title}</h4>
                                            <div className='flex items-center gap-2 text-xs font-bold text-gray-400 mt-1 mb-3'>
                                                <span className='text-indigo-500'>{discussion.userId?.name}</span>
                                                <span>•</span>
                                                <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed'>{discussion.text}</p>

                                    {/* Replies Section */}
                                    <div className='mt-6 pl-4 border-l-2 border-indigo-100 dark:border-zinc-800 space-y-4'>
                                        {discussion.replies.map((reply, idx) => (
                                            <div key={idx} className='flex gap-3'>
                                                {reply.userId?.photoUrl ? (
                                                    <img src={reply.userId.photoUrl} alt="avatar" className='w-8 h-8 rounded-full object-cover' />
                                                ) : (
                                                    <div className='w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-500'>
                                                        {reply.userId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div className='flex-1 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4'>
                                                    <div className='flex justify-between items-center mb-1'>
                                                        <span className='text-xs font-black text-gray-900 dark:text-gray-200 flex items-center gap-2'>
                                                            {reply.userId?.name}
                                                            {reply.userId?.role === 'educator' && (
                                                                <span className='bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider'>Instructor</span>
                                                            )}
                                                        </span>
                                                        <span className='text-[10px] text-gray-400 font-medium'>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{reply.text}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Reply Input */}
                                        {replyingTo === discussion._id ? (
                                            <div className='mt-4 flex gap-2'>
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Write a reply..."
                                                    className='flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:text-white focus:ring-1 focus:ring-indigo-500'
                                                    onKeyPress={(e) => e.key === 'Enter' && handlePostReply(discussion._id)}
                                                />
                                                <button
                                                    onClick={() => handlePostReply(discussion._id)}
                                                    className='px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700'
                                                >
                                                    Reply
                                                </button>
                                                <button
                                                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                    className='px-3 py-2 text-gray-400 hover:text-red-500 text-sm font-bold'
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setReplyingTo(discussion._id); setReplyText(''); }}
                                                className='text-xs font-black text-indigo-500 hover:text-indigo-600 mt-2 uppercase tracking-widest'
                                            >
                                                + Add Reply
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DiscussionBoard;
