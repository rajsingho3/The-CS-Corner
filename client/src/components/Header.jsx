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
            <Navbar className='bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50'>
                <div className="flex justify-between items-center w-full px-4">
                    <Link to='/' className='flex items-center gap-2 font-bold text-xl'>
                        <div className='flex items-center gap-1'>
                            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                                <span className='text-white font-bold text-sm'>ER</span>
                            </div>
                            <span className='text-white'>Engineering</span>
                            <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>Reference</span>
                        </div>
                    </Link>
                
                {/* Desktop Search Box */}
                <div className='flex-grow max-w-md mx-8 hidden md:block'>
                    <form className='relative' onSubmit={handleSearchSubmit}>
                        <TextInput
                            type="text"
                            placeholder="Search articles..."
                            className='w-full bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500'
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onClick={handleSearchClick}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-slate-700 text-gray-300 text-xs px-2 py-1 rounded border border-slate-600">
                            Ctrl + K
                        </span>
                    </form>
                </div>

                {/* Mobile Search Icon */}
                <div className='md:hidden'>
                    <button onClick={handleSearchClick} className='p-2 text-gray-400 hover:text-white transition-colors'>
                        <AiOutlineSearch className='text-xl' />
                    </button>
                </div>

                <div className='flex items-center gap-4'>                    <div className='hidden md:flex items-center gap-6'>
                        <Link to='/' className={`text-sm font-medium transition-colors ${path === '/' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            Home
                        </Link>
                        <Link to='/about' className={`text-sm font-medium transition-colors ${path === '/about' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            About
                        </Link>
                        <Link to='/pyq-browser' className={`text-sm font-medium transition-colors ${path === '/pyq-browser' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            PYQ Papers
                        </Link>
                        <Link to='/project' className={`text-sm font-medium transition-colors ${path === '/project' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            Project
                        </Link>
                    </div>

                  
                    
                    {currentUser ? (
                        <Dropdown arrowIcon={false} inline label={
                            <div className="relative group cursor-pointer">
                                <Avatar
                                    alt='User'
                                    img={currentUser.profilePicture || defaultProfilePicture} 
                                    rounded
                                    className="ring-2 ring-purple-500/50 group-hover:ring-purple-400 transition-all duration-300"
                                />                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
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
                            <button className='bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105'>
                                Sign in
                            </button>
                        </Link>
                    )}
                    
                    <button className='md:hidden p-2 text-gray-400 hover:text-white'>
                        <Navbar.Toggle />
                    </button>
                </div>
            </div>
            
            <Navbar.Collapse className="md:hidden bg-slate-800 border-t border-slate-700 mt-2">                <div className="flex flex-col gap-2 p-4">
                    <Link to='/' className={`p-2 rounded transition-colors ${path === '/' ? 'text-purple-400 bg-slate-700' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}>
                        Home
                    </Link>
                    <Link to='/about' className={`p-2 rounded transition-colors ${path === '/about' ? 'text-purple-400 bg-slate-700' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}>
                        About
                    </Link>
                    <Link to='/pyq-browser' className={`p-2 rounded transition-colors ${path === '/pyq-browser' ? 'text-purple-400 bg-slate-700' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}>
                        PYQ Papers
                    </Link>
                    <Link to='/project' className={`p-2 rounded transition-colors ${path === '/project' ? 'text-purple-400 bg-slate-700' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}>
                        Project
                    </Link>
                </div>
            </Navbar.Collapse>
            
            {/* Custom Dropdown Styles */}
            <style jsx global>{`
                .flowbite-dropdown {
                    background: rgb(30 41 59 / 0.95) !important;
                    backdrop-filter: blur(12px) !important;
                    border: 1px solid rgb(71 85 105) !important;
                    border-radius: 16px !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                    min-width: 320px !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-content {
                    padding: 0 !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-item {
                    border-radius: 8px !important;
                    margin: 2px 8px !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-item:hover {
                    background-color: rgb(51 65 85) !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-divider {
                    margin: 8px 0 !important;
                    border-color: rgb(71 85 105) !important;
                }
                
                .flowbite-dropdown .flowbite-dropdown-header {
                    background: linear-gradient(135deg, rgb(71 85 105) 0%, rgb(51 65 85) 100%) !important;
                    border-radius: 12px 12px 0 0 !important;
                    margin-bottom: 8px !important;
                }
                
                @keyframes dropdownSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .flowbite-dropdown {
                    animation: dropdownSlide 0.2s ease-out !important;
                }
                
                @keyframes searchPopupIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-40px);
                        filter: blur(4px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                        filter: blur(0);
                    }
                }
                
                .animate-in {
                    animation: searchPopupIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                }

                /* Custom scrollbar for search popup */
                .search-popup-content::-webkit-scrollbar {
                    width: 6px;
                }
                
                .search-popup-content::-webkit-scrollbar-track {
                    background: rgba(51, 65, 85, 0.3);
                    border-radius: 3px;
                }
                
                .search-popup-content::-webkit-scrollbar-thumb {
                    background: rgba(139, 92, 246, 0.5);
                    border-radius: 3px;
                }
                
                .search-popup-content::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.7);
                }

                /* Glow effect for focused search input */
                .search-input-glow:focus-within {
                    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3), 
                                0 0 0 4px rgba(139, 92, 246, 0.1),
                                0 8px 32px rgba(139, 92, 246, 0.15);
                }

                /* Shimmer effect for popular searches */
                @keyframes shimmer {
                    0% { background-position: -200px 0; }
                    100% { background-position: 200px 0; }
                }
                
                .shimmer-bg {
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
                    background-size: 200px 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>
            </Navbar>
            
            {/* Search Popup Modal - Outside Navbar */}
            {isSearchPopupVisible && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4'>
                    <div ref={searchPopupRef} className='bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out animate-in overflow-hidden'>
                        {/* Header with close button */}
                        <div className='flex items-center justify-between p-6 pb-4 border-b border-slate-700/50'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                                    <AiOutlineSearch className='text-white text-lg' />
                                </div>
                                <div>
                                    <h2 className='text-white font-semibold text-lg'>Search Articles</h2>
                                    <p className='text-gray-400 text-sm'>Find what you're looking for</p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleSearchClose}
                                className='w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200'
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearchSubmit} className='p-6 space-y-6'>
                            <div className='relative group'>
                                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl'></div>
                                <div className='relative'>
                                    <AiOutlineSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-purple-400 transition-colors duration-200' />
                                    <TextInput
                                        type="text"
                                        placeholder="Search for articles, topics, or keywords..."
                                        className='w-full pl-12 pr-24 bg-slate-700/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 text-lg py-4 rounded-xl transition-all duration-200'
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        autoFocus
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                        <kbd className='px-2 py-1 bg-slate-600/70 text-gray-300 text-xs rounded font-medium border border-slate-500/50'>
                                            ⌘ K
                                        </kbd>
                                    </div>
                                </div>
                            </div>

                          

                            {/* Action buttons */}
                            <div className='flex items-center justify-between pt-4 border-t border-slate-700/50'>
                                <div className='flex items-center gap-4 text-gray-400 text-sm'>
                                    <div className='flex items-center gap-1'>
                                        <kbd className='px-2 py-1 bg-slate-700/50 rounded text-xs border border-slate-600/50'>Esc</kbd>
                                        <span>to close</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <kbd className='px-2 py-1 bg-slate-700/50 rounded text-xs border border-slate-600/50'>Enter</kbd>
                                        <span>to search</span>
                                    </div>
                                </div>
                                <div className='flex gap-3'>
                                    <button 
                                        type="button" 
                                        onClick={handleSearchClose}
                                        className='px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-700/50'
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={!searchTerm.trim()}
                                        className='px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95'
                                    >
                                        <div className='flex items-center gap-2'>
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
