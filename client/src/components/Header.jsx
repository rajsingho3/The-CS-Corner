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

    const defaultProfilePicture = 'path/to/default/profile/picture.jpg';

    return (
        <Navbar className='border-b-2 flex justify-between items-center p-1.5'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg text-white'>
                    Engineering
                </span>
                Reference
            </Link>
            <div className='flex-grow max-w-sm relative ml-4'> {/* Add margin-left */}
                {isSearchBoxVisible || !isSmallScreen ? ( // Conditionally render based on state and screen size
                    <form className='w-full ' onSubmit={handleSearchSubmit}>
                        
                        <TextInput
                            type="text"
                            placeholder="Search.."
                            className='w-full text-sm  py-1 px-2'
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onClick={handleSearchClick} // Add onClick handler
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white text-xs px-2 py-0.5 rounded-md">
                                           Ctrl + K
                                        </span>
                        
                        
                    </form>
                ) : (
                    <AiOutlineSearch className='text-gray-600 cursor-pointer sm:hidden text-2xl' onClick={toggleSearchBox} /> // Improved visibility
                )}
                {isSearchPopupVisible && (
                    <div className='fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50'> {/* Add blur effect */}
                        <div ref={searchPopupRef} className='bg-gray-700 p-10 rounded-lg shadow-xl w-11/12 sm:w-2/3 lg:w-1/2 h-96 border-2 border-blue-500'> {/* Add gradient border */}
                            <form onSubmit={handleSearchSubmit} className='flex flex-col h-full'>
                                <div className='relative w-full'>
                                    <TextInput
                                        type="text"
                                        placeholder="Search..."
                                        className='w-full pr-10 text-sm py-2 pl-10 border-blue-700' // Add border color class
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    <AiOutlineSearch 
                                        className='absolute right-12 top-1/2 transform -translate-y-1/2 text-white cursor-pointer' // Increase visibility
                                        onClick={handleSearchSubmit} // Add onClick handler to perform search
                                    />
                                </div>
                                
                                <div className='mt-auto flex justify-center'>
                                    <Button gradientDuoTone='purpleToPink' type="button" className='w-text text-white-500 ' onClick={handleSearchClose}>Close</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Navbar.Collapse>
                <Navbar.Link className={path === '/' ? 'text-blue-500' : ''} as={'div'}>
                    <Link to='/'>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link className={path === '/about' ? 'text-blue-500' : ''} as={'div'}>
                    <Link to='/about'>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link className={path === '/project' ? 'text-blue-500' : ''} as={'div'}>
                    <Link to='/project'>
                        Project
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
            <div className='flex items-center gap-1'> {/* Reduced gap from 2 to 1 */}
                {!isSmallScreen && ( // Hide dark mode button on small screens
                    <Button className='w-12 h-10 flex justify-center items-center' color='gray' pill size='sm' onClick={() => dispatch(toggleTheme())}>
                        {theme === 'light' ? <FaSun /> : <FaMoon />}
                    </Button>
                )}
                {currentUser ? (
                    <Dropdown arrowIcon={false} inline label={<Avatar
                        alt='User'
                        img={currentUser.profilePicture || defaultProfilePicture} rounded
                    />}>
                        <Dropdown.Header>
                            <span className='block text-sm'>{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
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
                        <Button gradientDuoTone='purpleToPink' outline>
                            Sign in
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
        </Navbar>
    )
}
