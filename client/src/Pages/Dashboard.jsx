import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashboardComp from '../components/DashboardComp';
import DashPosts from '../components/DashPosts';
import DashComments from '../components/DashComments';
import DashPYQs from '../components/DashPYQs';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const getPageTitle = () => {
    switch (tab) {
      case 'profile': return 'Profile Settings';
      case 'posts': return 'Manage Posts';
      case 'dash': return 'Dashboard Overview';
      case 'comments': return 'Comments';      case 'pyqs': return 'Manage PYQs';
      default: return 'Profile Settings';
    }
  };
  const getPageDescription = () => {
    switch (tab) {
      case 'profile': return 'Update your profile information and preferences';
      case 'posts': return 'Create, edit, and manage your published articles';
      case 'dash': return 'View your content statistics and analytics';
      case 'comments': return 'Moderate and respond to comments';      case 'pyqs': return 'Manage and oversee all PYQ papers in the system';
      default: return 'Update your profile information and preferences';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className='flex'>
        {/* Sidebar */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:block min-h-screen
        `}>
          <DashSidebar />
        </div>
        
        {/* Main Content */}
        <div className='flex-1 min-h-screen'>
          {/* Header */}
          <header className='bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-b border-slate-600 sticky top-0 z-30'>
            <div className='px-6 py-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className='md:hidden p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors'
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  <div>
                    <h1 className='text-2xl md:text-3xl font-bold text-white'>
                      {getPageTitle()}
                    </h1>
                    <p className='text-gray-300 text-sm mt-1 hidden sm:block'>
                      {getPageDescription()}
                    </p>
                  </div>
                </div>

                {/* User Info */}
                <div className='flex items-center space-x-3'>
                  <div className='hidden sm:block text-right'>
                    <p className='text-white font-medium'>{currentUser?.username}</p>
                    <p className='text-gray-300 text-sm'>{currentUser?.email}</p>
                  </div>
                  <img
                    src={currentUser?.profilePicture}
                    alt={currentUser?.username}
                    className='w-10 h-10 rounded-full border-2 border-purple-500/30'
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className='p-6'>
            <div className='max-w-7xl mx-auto'>              {/* Content based on active tab */}
              {tab === 'profile' && <DashProfile />}
              {tab === 'posts' && <DashPosts />}
              {tab === 'dash' && <DashboardComp />}
              {tab === 'comments' && <DashComments />}
              {tab === 'pyqs' && currentUser?.isAdmin && <DashPYQs />}
              {!tab && <DashProfile />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}