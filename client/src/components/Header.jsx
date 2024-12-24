import React, { useEffect, useState } from 'react';
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm.trim() && isSmallScreen) {
            setIsSearchBoxVisible(false);
        } else {
            navigate(`search/?searchTerm=${searchTerm}`);
        }
    };

    const toggleSearchBox = () => {
        setIsSearchBoxVisible(!isSearchBoxVisible);
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
        <Navbar className='border-b-2 flex justify-between items-center p-4'>
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg text-white'>
                    Engineering
                </span>
                Reference
            </Link>
            <div className='flex-grow max-w-sm relative ml-4'> {/* Add margin-left */}
                {isSearchBoxVisible || !isSmallScreen ? ( // Conditionally render based on state and screen size
                    <form className='w-full' onSubmit={handleSearchSubmit}>
                        <TextInput
                            type="text"
                            placeholder="Search..."
                            className='w-full pr-10 text-sm py-1'
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        
                    </form>
                ) : (
                    <AiOutlineSearch className='text-gray-600 cursor-pointer sm:hidden text-2xl' onClick={toggleSearchBox} /> // Improved visibility
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
            <div className='flex items-center gap-2'>
                <Button className='w-12 h-10 flex justify-center items-center' color='gray' pill size='sm' onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
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
