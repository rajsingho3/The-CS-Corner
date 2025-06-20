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
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
        <Navbar className='bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50'>
            <div className="flex justify-between items-center w-full px-4">
                <Link to='/' className='flex items-center gap-2 font-bold text-xl'>
                    <div className='flex items-center gap-1'>
                        <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                            <span className='text-white font-bold text-sm'>ER</span>
                        </div>
                        <span className='text-white hidden sm:block'>Engineering</span>
                        <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hidden sm:block'>Reference</span>
                    </div>
                </Link>
                
                <div className='flex-grow max-w-md mx-8 hidden md:block'>
                    {isSearchBoxVisible || !isSmallScreen ? (
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
                    ) : (
                        <button onClick={toggleSearchBox} className='p-2 text-gray-400 hover:text-white transition-colors'>
                            <AiOutlineSearch className='text-xl' />
                        </button>
                    )}
                    {isSearchPopupVisible && (
                        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50'>
                            <div ref={searchPopupRef} className='bg-slate-800 p-8 rounded-2xl shadow-2xl w-11/12 sm:w-2/3 lg:w-1/2 max-w-2xl border border-slate-600'>
                                <form onSubmit={handleSearchSubmit} className='space-y-6'>
                                    <div className='relative'>
                                        <AiOutlineSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl' />
                                        <TextInput
                                            type="text"
                                            placeholder="Search articles..."
                                            className='w-full pl-12 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500 text-lg py-3'
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            autoFocus
                                        />
                                    </div>
                                    <div className='flex justify-end gap-3'>
                                        <button 
                                            type="button" 
                                            onClick={handleSearchClose}
                                            className='px-4 py-2 text-gray-400 hover:text-white transition-colors'
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className='px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all'
                                        >
                                            Search
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                <div className='flex items-center gap-4'>
                    <div className='hidden md:flex items-center gap-6'>
                        <Link to='/' className={`text-sm font-medium transition-colors ${path === '/' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            Home
                        </Link>
                        <Link to='/about' className={`text-sm font-medium transition-colors ${path === '/about' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            About
                        </Link>
                        <Link to='/project' className={`text-sm font-medium transition-colors ${path === '/project' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                            Project
                        </Link>
                    </div>

                    <button 
                        onClick={() => dispatch(toggleTheme())}
                        className='p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800'                    >
                        {theme === 'light' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                    </button>
                    
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
            
            <Navbar.Collapse className="md:hidden bg-slate-800 border-t border-slate-700 mt-2">
                <div className="flex flex-col gap-2 p-4">
                    <Link to='/' className={`p-2 rounded transition-colors ${path === '/' ? 'text-purple-400 bg-slate-700' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}>
                        Home
                    </Link>
                    <Link to='/about' className={`p-2 rounded transition-colors ${path === '/about' ? 'text-purple-400 bg-slate-700' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}>
                        About
                    </Link>
                    <Link to='/project' className={`p-2 rounded transition-colors ${path === '/project' ? 'text-purple-400 bg-slate-700' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}>
                        Project
                    </Link>
                    <div className='mt-4 md:hidden'>
                        <button onClick={toggleSearchBox} className='w-full p-3 bg-slate-700 text-gray-300 rounded-lg flex items-center gap-3'>
                            <AiOutlineSearch />                            <span>Search articles...</span>
                        </button>
                    </div>
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
            `}</style>
        </Navbar>
    )
}
