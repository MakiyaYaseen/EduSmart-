import React, { useState, useEffect } from 'react';
// import logo from "../assets/logo.jpg";
const logo = "/logo.jpg";
import { IoPersonCircle, IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../constants';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import useGetCurrentUser from '../customHooks/getCurrentUser';
import ThemeToggle from './ThemeToggle';

const Nav = () => {
    const { userData } = useSelector(state => state.user);
    const loading = useGetCurrentUser();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [showHam, setShowHam] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const firstLetter = userData?.email ? userData.email[0].toUpperCase() : '';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (userData) {
            fetchNotifications();
        }
    }, [userData]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/notification`, { withCredentials: true });
            setNotifications(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${serverUrl}/api/notification/read/${id}`, {}, { withCredentials: true });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleLogOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
            dispatch(setUserData(null));
            toast.success("LogOut Successfully");
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout Failed");
        }
    };

    // Avatar component
    const ProfileAvatar = (
        <div
            className='w-11 h-11 rounded-xl border-2 border-indigo-500/30 flex items-center justify-center text-white text-xl font-bold cursor-pointer overflow-hidden shadow-lg hover:border-indigo-500 transition-all duration-300'
            onClick={() => setShow(prev => !prev)}
        >
            {userData?.photoUrl ? (
                <img
                    src={userData.photoUrl}
                    alt="Profile"
                    className='w-full h-full object-cover'
                />
            ) : (
                <div className='w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center'>
                    {firstLetter}
                </div>
            )}
        </div>
    );

    // Mobile Avatar component
    const MobileAvatar = (
        userData?.photoUrl ? (
            <img
                src={userData.photoUrl}
                alt="Profile"
                className='w-12 h-12 rounded-xl object-cover cursor-pointer border-2 border-white/20'
                onClick={() => setShowHam(prev => !prev)}
            />
        ) : (
            <div
                className='w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 border-2 border-white/20 flex items-center justify-center text-white text-xl font-bold cursor-pointer'
                onClick={() => setShowHam(prev => !prev)}
            >
                {firstLetter}
            </div>
        )
    );

    const handleScrollNavigation = (id) => {
        if (window.location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setShowHam(false);
    };

    return (
        <nav className={`w-full fixed top-0 px-6 md:px-12 flex items-center justify-between z-[60] transition-all duration-500 ${isScrolled ? 'h-[70px] bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-xl' : 'h-[90px] bg-transparent'}`}>

            {/* Logo Section */}
            <div className='flex items-center gap-3 cursor-pointer group' onClick={() => navigate("/")}>
                <div className='relative'>
                    <div className='absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500'></div>
                    <img src={logo} alt="Logo" className='w-10 h-10 rounded-xl border border-white/10 relative z-10 group-hover:rotate-6 transition-all duration-300 shadow-2xl' />
                </div>
                <div className='flex flex-col'>
                    <span className='text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none'>EduSmart</span>
                    <span className='text-[8px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mt-1'>Education Reimagined</span>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center gap-10'>
                <div className='flex items-center gap-8'>
                    {["Home", "Courses", "About", "Reviews", "Contact"].map((item) => (
                        <span
                            key={item}
                            onClick={() => item === "Courses" ? navigate("/allcourses") : handleScrollNavigation(item.toLowerCase())}
                            className='text-sm font-black text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-all relative group py-2'
                        >
                            {item}
                            <span className='absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full'></span>
                        </span>
                    ))}
                </div>

                <ThemeToggle />

                {userData ? (
                    <div className='flex items-center gap-6 relative'>
                        {/* Notifications */}
                        <div className='relative'>
                            <button onClick={() => { setShowNotif(!showNotif); setShow(false); }} className='relative p-2 mt-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors'>
                                <IoNotificationsOutline size={26} />
                                {unreadCount > 0 && (
                                    <span className='absolute top-1 right-1 w-4 h-4 bg-red-500 text-white flex items-center justify-center text-[10px] font-bold rounded-full border border-white dark:border-zinc-900 shadow-sm'>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {/* Notification Dropdown */}
                            {showNotif && (
                                <div className='absolute top-[60px] right-[-50px] w-[320px] bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border border-black/5 dark:border-white/10 flex flex-col z-50 overflow-hidden glass-effect'>
                                    <div className='p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-black/20'>
                                        <h3 className='font-black text-gray-900 dark:text-white'>Notifications</h3>
                                        {unreadCount > 0 && <span className='text-[10px] font-black uppercase text-indigo-500 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-md tracking-wider'>{unreadCount} New</span>}
                                    </div>
                                    <div className='max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col p-2 gap-1'>
                                        {notifications.length === 0 ? (
                                            <div className='text-center py-6 text-gray-400'>
                                                <IoNotificationsOutline size={32} className='mx-auto mb-2 opacity-20' />
                                                <span className='text-[10px] font-black uppercase tracking-widest'>All caught up!</span>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div key={notif._id} onClick={() => {
                                                    markAsRead(notif._id);
                                                    if (notif.link) {
                                                        navigate(notif.link);
                                                        setShowNotif(false);
                                                    }
                                                }} className={`p-4 rounded-xl cursor-pointer transition-all border ${notif.isRead ? 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5 opacity-70' : 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 shadow-sm'}`}>
                                                    <div className='flex justify-between items-start mb-1'>
                                                        <h4 className='text-sm font-bold text-gray-900 dark:text-white'>{notif.title}</h4>
                                                        <span className='text-[10px] text-gray-400 font-medium'>{new Date(notif.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className='text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2'>{notif.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='relative'>
                            {ProfileAvatar}
                            {/* Dropdown Menu */}
                            {show && (
                                <div className='absolute top-[60px] right-0 w-[220px] bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-2 border border-black/5 dark:border-white/10 glass-effect flex flex-col gap-1 z-50'>
                                    <div className='px-4 py-3 border-b border-black/5 dark:border-white/10 mb-1'>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>Signed in as</p>
                                        <p className='text-sm font-bold text-gray-900 dark:text-white truncate'>{userData.email}</p>
                                    </div>
                                    <button
                                        className='w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all flex items-center gap-3'
                                        onClick={() => { navigate("/profile"); setShow(false); }}
                                    >
                                        <div className='w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center'>
                                            <IoPersonCircle className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
                                        </div>
                                        My Profile
                                    </button>
                                    {userData?.role === "student" && (
                                        <button
                                            className='w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-all flex items-center gap-3'
                                            onClick={() => { navigate("/mycourses"); setShow(false); }}
                                        >
                                            <div className='w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center'>
                                                <div className='w-4 h-4 rounded-sm border-2 border-emerald-600 dark:border-emerald-400'></div>
                                            </div>
                                            My Courses
                                        </button>
                                    )}
                                    {userData?.role === "educator" && (
                                        <button
                                            className='w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all flex items-center gap-3'
                                            onClick={() => { navigate("/dashboard"); setShow(false); }}
                                        >
                                            <div className='w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center'>
                                                <div className='w-4 h-4 rounded-sm border-2 border-purple-600 dark:border-purple-400'></div>
                                            </div>
                                            Dashboard
                                        </button>
                                    )}
                                    <button
                                        className='w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-3'
                                        onClick={() => { handleLogOut(); setShow(false); }}
                                    >
                                        <div className='w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center'>
                                            <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full'></div>
                                        </div>
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center gap-4'>
                        <button
                            className='px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className='px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-105 transition-all'
                            onClick={() => navigate("/signup")}
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Hamburger */}
            <GiHamburgerMenu
                className='w-[35px] h-[35px] text-black dark:text-white lg:hidden cursor-pointer'
                onClick={() => setShowHam(prev => !prev)}
            />

            {/* Mobile Menu */}
            <div className={`fixed inset-0 w-screen h-screen bg-[#0f172a]/95 backdrop-blur-xl z-[100] lg:hidden transition-all duration-500 overflow-y-auto custom-scrollbar ${showHam ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>

                {/* Close Button & Header */}
                <div className="w-full h-[70px] px-6 flex items-center justify-between border-b border-white/5">
                    <div className='flex items-center gap-3'>
                        <img src={logo} alt="Logo" className='w-8 rounded-lg' />
                        <span className='text-lg font-black text-white tracking-tighter'>EduSmart</span>
                    </div>
                    <button
                        onClick={() => setShowHam(false)}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"
                    >
                        <ImCross size={16} />
                    </button>
                </div>

                <div className="px-6 py-8 flex flex-col gap-10">
                    {/* User Info Section */}
                    {userData && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                            {MobileAvatar}
                            <div className="flex flex-col min-w-0">
                                <p className="text-sm font-bold text-white truncate">{userData.email}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#c5a059]">{userData.role}</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className='flex flex-col gap-2'>
                        <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 mb-2">Explore</p>
                        <span onClick={() => { handleScrollNavigation("home"); setShowHam(false); }} className='text-2xl font-bold text-white py-3 border-b border-white/5'>Home</span>
                        <span onClick={() => { navigate("/allcourses"); setShowHam(false); }} className='text-2xl font-bold text-white py-3 border-b border-white/5'>Courses</span>
                        <span onClick={() => { handleScrollNavigation("about"); setShowHam(false); }} className='text-2xl font-bold text-white py-3 border-b border-white/5'>About</span>
                        <span onClick={() => { handleScrollNavigation("reviews"); setShowHam(false); }} className='text-2xl font-bold text-white py-3 border-b border-white/5'>Reviews</span>
                        <span onClick={() => { handleScrollNavigation("contact"); setShowHam(false); }} className='text-2xl font-bold text-white py-3 border-b border-white/5'>Contact</span>
                    </div>

                    {/* Account Settings */}
                    <div className='flex flex-col gap-4 mb-20'>
                        <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 mb-2">Account Management</p>

                        {!userData ? (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => { navigate("/login"); setShowHam(false); }}
                                    className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg"
                                >
                                    Login to Account
                                </button>
                                <button
                                    onClick={() => { navigate("/signup"); setShowHam(false); }}
                                    className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-600/20"
                                >
                                    Join for Free
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => { navigate("/profile"); setShowHam(false); }}
                                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-white hover:bg-white/10 transition-all text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                        <IoPersonCircle size={24} className="text-indigo-400" />
                                    </div>
                                    <span className="font-bold">Personal Profile</span>
                                </button>

                                {userData?.role === "student" && (
                                    <button
                                        onClick={() => { navigate("/mycourses"); setShowHam(false); }}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-white hover:bg-white/10 transition-all text-left"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-sm border-2 border-emerald-400"></div>
                                        </div>
                                        <span className="font-bold">My Learning</span>
                                    </button>
                                )}

                                {userData?.role === "educator" && (
                                    <button
                                        onClick={() => { navigate("/dashboard"); setShowHam(false); }}
                                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-white hover:bg-white/10 transition-all text-left"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-md border-2 border-purple-400"></div>
                                        </div>
                                        <span className="font-bold">Instructor Dashboard</span>
                                    </button>
                                )}

                                <button
                                    onClick={handleLogOut}
                                    className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500 hover:bg-red-500/20 transition-all text-left mt-4"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                                    </div>
                                    <span className="font-bold text-lg">Sign Out</span>
                                </button>
                            </div>
                        )}

                        <div className="mt-4 flex justify-center">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
