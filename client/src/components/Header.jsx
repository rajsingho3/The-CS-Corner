import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import 'flowbite/dist/flowbite.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme} from '../redux/theme/themeSlice';
import { signoutScuccess } from '../redux/user/userSlice';

export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const navigate = useNavigate();    const currentUser = useSelector(state => state.user.currentUser);
    const theme = useSelector(state => state.theme.theme);
    
    const [searchTerm, setSearchTerm] = useState(''); // Add setSearchTerm
    const location = useLocation(); // Add useLocation
    const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false); // Add state for search box visibility
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640); // Add state for screen size
    const [isSearchPopupVisible, setIsSearchPopupVisible] = useState(false); // Add state for search popup visibility
    const searchPopupRef = useRef(null); // Add ref for search popup

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);        }
    }, [location.search]);

    // Redirect to sign-in page if no user is signed in and not already on auth pages
    useEffect(() => {
        const authPages = ['/signin', '/signup', '/otp-verify'];
        const isOnAuthPage = authPages.some(page => path === page);
        
        if (!currentUser && !isOnAuthPage) {
            navigate('/signin');
        }
    }, [currentUser, path, navigate]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsSearchPopupVisible(true);
            }
            if (e.key === 'Escape' && isSearchPopupVisible) {
                e.preventDefault();
                setIsSearchPopupVisible(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSearchPopupVisible]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchPopupRef.current && !searchPopupRef.current.contains(event.target)) {
                setIsSearchPopupVisible(false);
            }
        };

        if (isSearchPopupVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchPopupVisible]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm.trim() && isSmallScreen) {
            setIsSearchBoxVisible(false);
        } else {
            navigate(`search/?searchTerm=${searchTerm}`);
            setIsSearchPopupVisible(false); // Hide search popup after search
        }
    };

    const toggleSearchBox = () => {
        setIsSearchBoxVisible(!isSearchBoxVisible);
    };

    const handleSearchClick = () => {
        setIsSearchPopupVisible(true);
    };

    const handleSearchClose = () => {
        setIsSearchPopupVisible(false);
    };

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutScuccess());
                navigate('/signin');
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const defaultProfilePicture = 'path/to/default/profile/picture.jpg';
    
    return (
        <>
            <Navbar className='bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/70 sticky top-0 z-50 shadow-2xl shadow-black/20 transition-all duration-300'>
                <div className="flex justify-between items-center w-full px-3 sm:px-4 py-0">
                    <Link to='/' className='flex items-center gap-2 font-bold text-sm sm:text-base lg:text-xl min-w-0 flex-shrink-0 group transition-all duration-300 hover:scale-105'>
                        <div className='flex items-center gap-1.5 sm:gap-2'>
                            
                            <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:rotate-3'>
                                <span className='text-white font-bold text-sm sm:text-base'>ER</span>
                            </div>
                            {/* Desktop full text version with enhanced gradient */}
                            <div className='hidden sm:flex flex-col sm:flex-row sm:items-center sm:gap-1 transition-all duration-300 group-hover:translate-x-1'>
                                <span className='text-white text-sm sm:text-base lg:text-xl leading-tight font-semibold tracking-wide drop-shadow-sm'>Engineering</span>
                                <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent text-sm sm:text-base lg:text-xl leading-tight font-bold tracking-wide drop-shadow-sm animate-gradient'>Reference</span>
                            </div>
                            {/* Mobile shortened version */}
                            <div className='flex sm:hidden items-center'>
                                <span className='text-white text-base font-bold drop-shadow-sm'>Engineering Reference</span>
                            </div>
                        </div>
                    </Link>
                
                {/* Desktop Search Box with enhanced styling */}
                <div className='flex-grow max-w-md mx-4 lg:mx-8 hidden md:block'>
                    <form className='relative group' onSubmit={handleSearchSubmit}>
                        <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-all duration-300 blur-sm'></div>
                        <TextInput
                            type="text"
                            placeholder="Search articles, tutorials, and more..."
                            className='w-full bg-slate-800/80 border-slate-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 hover:bg-slate-800 backdrop-blur-sm rounded-xl'
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onClick={handleSearchClick}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                            <AiOutlineSearch className='text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200' />
                            <span className="bg-slate-700/90 text-gray-300 text-xs px-2 py-1 rounded-md border border-slate-600/50 hidden md:inline font-medium backdrop-blur-sm shadow-sm">
                                Ctrl + K
                            </span>
                        </div>
                    </form>
                </div>

                {/* Right side controls */}
                <div className='flex items-center gap-1 sm:gap-2 lg:gap-4'>
                    {/* Mobile Search Icon with enhanced styling */}
                    <div className='md:hidden relative group'>
                        <button 
                            onClick={handleSearchClick} 
                            className='p-2 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-slate-800/80 hover:scale-110 backdrop-blur-sm border border-transparent hover:border-slate-600/30'
                            title="Search (Ctrl + K)"
                        >
                            <AiOutlineSearch className='text-lg' />
                        </button>
                        {/* Tooltip for mobile */}
                        <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
                            Search (Ctrl + K)
                        </div>
                    </div>

                    {/* Desktop Navigation with enhanced styling */}
                    <div className='hidden lg:flex items-center gap-8'>
                        <Link to='/' className={`text-sm font-medium transition-all duration-300 hover:scale-105 py-2 px-3 rounded-lg relative group ${path === '/' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            Home
                            {path === '/' && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>}
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
                        </Link>
                        <Link to='/about' className={`text-sm font-medium transition-all duration-300 hover:scale-105 py-2 px-3 rounded-lg relative group ${path === '/about' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            About
                            {path === '/about' && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>}
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
                        </Link>
                        <Link to='/pyq-browser' className={`text-sm font-medium transition-all duration-300 hover:scale-105 py-2 px-3 rounded-lg relative group ${path === '/pyq-browser' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            PYQ Papers
                            {path === '/pyq-browser' && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>}
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
                        </Link>
                        <Link to='/project' className={`text-sm font-medium transition-all duration-300 hover:scale-105 py-2 px-3 rounded-lg relative group ${path === '/project' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            Projects
                            {path === '/project' && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'></div>}
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
                        </Link>
                    </div>

                    {/* User Profile / Sign In with enhanced styling */}
                    {currentUser ? (
                        <Dropdown arrowIcon={false} inline label={
                            <div className="relative group cursor-pointer transition-all duration-300 hover:scale-105">
                                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md'></div>
                                <Avatar
                                    alt='User'
                                    img={currentUser.profilePicture || defaultProfilePicture} 
                                    rounded
                                    size="md"
                                    className="ring-2 ring-purple-500/50 group-hover:ring-purple-400 group-hover:ring-4 transition-all duration-300 relative z-10 shadow-lg"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full z-20 shadow-lg animate-pulse"></div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                            </div>
                        }>
                            <Dropdown.Header className="bg-slate-800 border-b border-slate-600">
                                <div className="flex items-center space-x-3 p-2">
                                    <Avatar
                                        alt='User'
                                        img={currentUser.profilePicture || defaultProfilePicture} 
                                        rounded
                                        className="ring-2 ring-purple-500/30"
                                        size="md"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className='text-white font-semibold text-base truncate'>{currentUser.username}</p>
                                        <p className='text-gray-400 text-sm truncate'>{currentUser.email}</p>
                                        {currentUser.isAdmin && (
                                            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 mt-1'>
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.636-.491-3.156-1.343-4.243a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Dropdown.Header>
                            
                            <div className="py-2">
                                <Link to={'/dashboard?tab=profile'}>
                                    <Dropdown.Item className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition-colors">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <div>
                                            <p className="text-white font-medium">Profile</p>
                                            <p className="text-gray-400 text-xs">Manage your account</p>
                                        </div>
                                    </Dropdown.Item>
                                </Link>
                            </div>
                            
                            <Dropdown.Divider className="border-slate-600" />
                            
                            <div className="p-2">
                                <Dropdown.Item 
                                    onClick={handleSignout}
                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-red-600/10 text-red-400 hover:text-red-300 transition-colors rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Sign out</p>
                                        <p className="text-red-400/70 text-xs">Leave your session</p>
                                    </div>
                                </Dropdown.Item>
                            </div>
                        </Dropdown>
                    ) : (
                        <Link to='/signin'>
                            <button className='bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 lg:px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 text-sm lg:text-base border border-purple-400/20 backdrop-blur-sm group relative overflow-hidden'>
                                <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                                <span className='relative z-10 flex items-center gap-2'>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </span>
                            </button>
                        </Link>
                    )}
                    
                    {/* Mobile Menu Toggle with enhanced styling */}
                    <div className='lg:hidden'>
                        <Navbar.Toggle className='p-2 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-slate-800/80 border-none focus:ring-0 hover:scale-110 backdrop-blur-sm border border-transparent hover:border-slate-600/30' />
                    </div>
                </div>
            </div>
            
            {/* Mobile Navigation Menu with enhanced styling */}
            <Navbar.Collapse className="lg:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/70 shadow-lg">
                <div className="flex flex-col gap-2 p-4">
                    <Link to='/' className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${path === '/' ? 'text-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-slate-700/80 border border-transparent hover:border-slate-600/30'}`}>
                        <div className='flex items-center gap-3'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className='font-medium'>Home</span>
                        </div>
                    </Link>
                    <Link to='/about' className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${path === '/about' ? 'text-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-slate-700/80 border border-transparent hover:border-slate-600/30'}`}>
                        <div className='flex items-center gap-3'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className='font-medium'>About</span>
                        </div>
                    </Link>
                    <Link to='/pyq-browser' className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${path === '/pyq-browser' ? 'text-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-slate-700/80 border border-transparent hover:border-slate-600/30'}`}>
                        <div className='flex items-center gap-3'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className='font-medium'>PYQ Papers</span>
                        </div>
                    </Link>
                    <Link to='/project' className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${path === '/project' ? 'text-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-slate-700/80 border border-transparent hover:border-slate-600/30'}`}>
                        <div className='flex items-center gap-3'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className='font-medium'>Projects</span>
                        </div>
                    </Link>
                </div>
            </Navbar.Collapse>
            
            {/* Custom Dropdown Styles with enhanced animations */}
            <style jsx global>{`
                /* Enhanced gradient animation */
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }

                /* Enhanced mobile responsive breakpoints */
                @media (max-width: 475px) {
                    .xs\:hidden {
                        display: none !important;
                    }
                    .xs\:flex {
                        display: flex !important;
                    }
                }

                /* Enhanced mobile header improvements */
                @media (max-width: 640px) {
                    .flowbite-dropdown {
                        min-width: 280px !important;
                        max-width: calc(100vw - 24px) !important;
                    }
                }

                /* Enhanced mobile menu toggle */
                .flowbite-navbar-toggle {
                    border: none !important;
                    background: transparent !important;
                    padding: 8px !important;
                }

                .flowbite-navbar-toggle:focus {
                    ring: 0 !important;
                    outline: none !important;
                }

                /* Enhanced dropdown styling */
                .flowbite-dropdown {
                    background: rgba(30, 41, 59, 0.95) !important;
                    backdrop-filter: blur(20px) !important;
                    border: 1px solid rgba(139, 92, 246, 0.3) !important;
                    border-radius: 20px !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 
                                0 0 0 1px rgba(139, 92, 246, 0.1) !important;
                    min-width: 320px !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-content {
                    padding: 0 !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-item {
                    border-radius: 12px !important;
                    margin: 4px 12px !important;
                    transition: all 0.3s ease !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-item:hover {
                    background-color: rgba(51, 65, 85, 0.8) !important;
                    transform: translateX(4px) !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-divider {
                    margin: 12px 0 !important;
                    border-color: rgba(139, 92, 246, 0.3) !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-header {
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%) !important;
                    border-radius: 16px 16px 0 0 !important;
                    margin-bottom: 12px !important;
                    border-bottom: 1px solid rgba(139, 92, 246, 0.3) !important;
                }
                
                /* Enhanced dropdown animations */
                @keyframes dropdownSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.9);
                        filter: blur(4px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        filter: blur(0);
                    }
                }
                
                .flowbite-dropdown {
                    animation: dropdownSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                }
                
                /* Enhanced search popup animations */
                @keyframes searchPopupIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(-60px);
                        filter: blur(8px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                        filter: blur(0);
                    }
                }
                
                .animate-in {
                    animation: searchPopupIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                }

                /* Enhanced custom scrollbar for search popup */
                .search-popup-content::-webkit-scrollbar {
                    width: 8px;
                }
                
                .search-popup-content::-webkit-scrollbar-track {
                    background: rgba(51, 65, 85, 0.4);
                    border-radius: 4px;
                }
                
                .search-popup-content::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(168, 85, 247, 0.6));
                    border-radius: 4px;
                    border: 1px solid rgba(139, 92, 246, 0.3);
                }
                
                .search-popup-content::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.8));
                }

                /* Enhanced glow effect for focused search input */
                .search-input-glow:focus-within {
                    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.4), 
                                0 0 0 4px rgba(139, 92, 246, 0.1),
                                0 12px 40px rgba(139, 92, 246, 0.2);
                }

                /* Enhanced shimmer effect */
                @keyframes shimmer {
                    0% { background-position: -300px 0; }
                    100% { background-position: 300px 0; }
                }
                
                .shimmer-bg {
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    background-size: 300px 100%;
                    animation: shimmer 2.5s infinite;
                }

                /* Enhanced floating effect */
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-3px); }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                /* Enhanced pulse animation */
                @keyframes pulse-glow {
                    0%, 100% { 
                        box-shadow: 0 0 5px rgba(139, 92, 246, 0.4),
                                    0 0 10px rgba(139, 92, 246, 0.3),
                                    0 0 15px rgba(139, 92, 246, 0.2);
                    }
                    50% { 
                        box-shadow: 0 0 10px rgba(139, 92, 246, 0.6),
                                    0 0 20px rgba(139, 92, 246, 0.4),
                                    0 0 30px rgba(139, 92, 246, 0.3);
                    }
                }
                
                .animate-pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>
            </Navbar>
            
            {/* Search Popup Modal - Outside Navbar */}
            {isSearchPopupVisible && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-2 sm:p-4'>
                    <div ref={searchPopupRef} className='bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out animate-in overflow-hidden max-h-[90vh]'>
                        {/* Header with close button */}
                        <div className='flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-700/50'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                                    <AiOutlineSearch className='text-white text-base sm:text-lg' />
                                </div>
                                <div>
                                    <h2 className='text-white font-semibold text-base sm:text-lg'>Search Articles</h2>
                                    <p className='text-gray-400 text-xs sm:text-sm'>Find what you're looking for</p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleSearchClose}
                                className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-700/50 hover:bg-slate-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200'
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearchSubmit} className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
                            <div className='relative group'>
                                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl'></div>
                                <div className='relative'>
                                    <AiOutlineSearch className='absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl group-focus-within:text-purple-400 transition-colors duration-200' />
                                    <TextInput
                                        type="text"
                                        placeholder="Search for articles, topics, or keywords..."
                                        className='w-full pl-10 sm:pl-12 pr-16 sm:pr-24 bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 text-base sm:text-lg py-3 sm:py-4 rounded-xl transition-all duration-200'
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        autoFocus
                                    />
                                    <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                        <kbd className='px-1.5 sm:px-2 py-1 bg-slate-600/70 text-gray-300 text-xs rounded font-medium border border-slate-500/50 hidden sm:inline'>
                                            ⌘ K
                                        </kbd>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 sm:pt-4 border-t border-slate-700/50 gap-3 sm:gap-0'>
                                <div className='flex items-center gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm justify-center sm:justify-start'>
                                    <div className='flex items-center gap-1'>
                                        <kbd className='px-1.5 sm:px-2 py-1 bg-slate-700/50 rounded text-xs border border-slate-600/50'>Esc</kbd>
                                        <span>to close</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <kbd className='px-1.5 sm:px-2 py-1 bg-slate-700/50 rounded text-xs border border-slate-600/50'>Enter</kbd>
                                        <span>to search</span>
                                    </div>
                                </div>
                                <div className='flex gap-2 sm:gap-3'>
                                    <button 
                                        type="button" 
                                        onClick={handleSearchClose}
                                        className='flex-1 sm:flex-none px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-700/50'
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={!searchTerm.trim()}
                                        className='flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95'
                                    >
                                        <div className='flex items-center justify-center gap-2'>
                                            <AiOutlineSearch className='text-sm' />
                                            Search
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
