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
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.user.currentUser);
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
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

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

    const defaultProfilePicture = 'path/to/default/profile/picture.jpg';    return (
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
                        className='p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800'
                    >
                        {theme === 'light' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
                    </button>

                    {currentUser ? (
                        <Dropdown arrowIcon={false} inline label={
                            <Avatar
                                alt='User'
                                img={currentUser.profilePicture || defaultProfilePicture} 
                                rounded
                                className="ring-2 ring-purple-500"
                            />
                        }>
                            <Dropdown.Header>
                                <span className='block text-sm font-medium'>{currentUser.username}</span>
                                <span className='block text-sm text-gray-500 truncate'>{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>
                                    Profile
                                </Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignout}>
                                Sign out
                            </Dropdown.Item>
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
                            <AiOutlineSearch />
                            <span>Search articles...</span>
                        </button>
                    </div>
                </div>
            </Navbar.Collapse>
        </Navbar>
    )
}
