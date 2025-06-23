import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiAcademicCap,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { signoutScuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  
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

  const sidebarItems = [
    ...(currentUser?.isAdmin ? [{
      to: '/dashboard?tab=dash',
      icon: HiChartPie,
      label: 'Dashboard',
      isActive: tab === 'dash' || !tab
    }] : []),
    {
      to: '/dashboard?tab=profile',
      icon: HiUser,
      label: 'Profile',
      badge: currentUser?.isAdmin ? 'Admin' : 'User',
      isActive: tab === 'profile'
    },    ...(currentUser?.isAdmin ? [{
      to: '/dashboard?tab=posts',
      icon: HiDocumentText,
      label: 'Posts',
      isActive: tab === 'posts'
    }] : []),
    ...(currentUser?.isAdmin ? [{
      to: '/dashboard?tab=pyqs',
      icon: HiAcademicCap,
      label: 'Manage PYQs',
      isActive: tab === 'pyqs'
    }] : []),
    {
      to: '/pyq-browser',
      icon: HiDocumentText,
      label: 'Browse PYQs',
      isActive: false
    },
    ...(currentUser?.isAdmin ? [{
      to: '/create-post',
      icon: HiAnnotation,
      label: 'Write Article',
      isActive: false
    }] : []),
    ...(currentUser?.isAdmin ? [{
      to: '/create-pyq',
      icon: HiAcademicCap,
      label: 'Upload PYQ',
      isActive: false
    }] : [])
  ];  return (
    <div className='bg-gradient-to-br from-slate-800 to-slate-700 w-full h-screen shadow-2xl border-r border-slate-600 overflow-y-auto'>
      <div className='p-6 h-full flex flex-col'>
        {/* User Profile Section */}
        <div className='mb-8'>
          <div className='flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl'>
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform rotate-3'></div>
              <img 
                src={currentUser?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} 
                alt="Profile" 
                className='relative w-12 h-12 rounded-full object-cover border-2 border-slate-600 transform -rotate-3'
                onError={(e) => {
                  e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
                }}
              />
            </div>            <div className='flex-1 min-w-0'>
              <p className='text-white font-semibold truncate'>
                {currentUser?.username || 'User'}
              </p>
              <p className='text-gray-300 text-sm truncate'>
                {currentUser?.email || 'email@example.com'}
              </p>
            </div>
          </div>
        </div>        {/* Navigation Items */}
        <nav className='flex-1 space-y-2'>
          {sidebarItems.map((item, index) => (
            <Link key={index} to={item.to}>
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                item.isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105' 
                  : 'text-gray-300 hover:bg-slate-600/50 hover:text-white'
              }`}>
                <item.icon className={`w-5 h-5 ${item.isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                <span className='font-medium'>{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    item.isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div className='pt-6 border-t border-slate-600'>
          <button
            onClick={handleSignout}
            className='w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-300 group'
          >
            <HiArrowSmRight className='w-5 h-5 text-gray-400 group-hover:text-red-400' />
            <span className='font-medium'>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}