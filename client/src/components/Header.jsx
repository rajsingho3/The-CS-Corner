import React from 'react';
import { Avatar, Button, Dropdown, Navbar, NavbarCollapse, TextInput } from "flowbite-react";
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import 'flowbite/dist/flowbite.css'; // Ensure this line is included
import {useSelector, useDispatch} from 'react-redux';
import { toggleTheme } from '../redux/theme/themeslice';

export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
    const theme = useSelector(state => state.theme.theme);
    const defaultProfilePicture = 'path/to/default/profile/picture.jpg'; // Add a default profile picture

  return (
    <Navbar className='border-b-2 flex justify-between items-center p-4'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg text-white'>
          Engineering
        </span>
        Reference
      </Link>
      <form className='flex-grow max-w-sm relative'> {/* Adjusted max-w-xs to max-w-sm */}
        <TextInput
          type="text"
          placeholder="Search..."
          className='w-full pr-10'
        />
        <AiOutlineSearch className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
      </form>
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
          {theme === 'light' ? <FaSun  /> : <FaMoon  />}
          
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
              <Dropdown.Divider/>
              <Dropdown.Item>
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
        
        <Navbar.Toggle/>
      </div>
    </Navbar>
  )
}
