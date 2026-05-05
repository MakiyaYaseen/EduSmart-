import React from 'react';
import { motion } from 'framer-motion';
import { IoShieldCheckmarkOutline, IoDocumentTextOutline, IoAnalyticsOutline } from "react-icons/io5";

const FeaturesSection = ({ certificateCount }) => {
    const features = [
        {
            icon: <IoAnalyticsOutline className="w-8 h-8" />,
            title: "Interactive Quizzes",
            desc: "Validate your knowledge with smart assessments at the end of every course module. Instant results to track your growth.",
            color: "bg-blue-500",
            shadow: "shadow-blue-500/20"
        },
        {
            icon: <IoDocumentTextOutline className="w-8 h-8" />,
            title: "Hands-on Assignments",
            desc: "Apply what you learn through real-world projects. Get personalized feedback and scores from expert educators.",
            color: "bg-indigo-600",
            shadow: "shadow-indigo-600/20"
        },
        {
            icon: <IoShieldCheckmarkOutline className="w-8 h-8" />,
            title: "Verifiable Certificates",
            desc: `Join ${certificateCount}+ certified learners. Earn professional, AI-verified certificates upon completion to boost your career.`,
            color: "bg-amber-500",
            shadow: "shadow-amber-500/20"
        }
    ];

    return (
        <div className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[4px]">The Full Ecosystem</h2>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                        Beyond Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Video Lectures</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                        We provide a complete learning experience designed to make you industry-ready through testing, practice, and recognition.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="glass-effect p-10 rounded-[40px] border-white/20 bg-white/40 dark:bg-zinc-900/40 shadow-2xl group hover:scale-[1.02] transition-all"
                        >
                            <div className={`w-16 h-16 ${feature.color} ${feature.shadow} rounded-2xl flex items-center justify-center text-white mb-8 group-hover:rotate-6 transition-transform shadow-xl`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full"></div>
        </div>
    );
};

export default FeaturesSection;
