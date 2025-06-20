import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashboardComp from '../components/DashboardComp';
import DashPosts from '../components/DashPosts';

import DashComments from '../components/DashComments';


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      <div className='flex'>
        {/* Sidebar */}
        <div className='hidden md:block md:w-64 min-h-screen sticky top-0'>
          <DashSidebar />
        </div>
        
        {/* Main Content */}
        <div className='flex-1 min-h-screen'>
          {/* profile... */}
          {tab === 'profile' && <DashProfile />}
          {/* posts... */}
          {tab === 'posts' && <DashPosts />}
          {/* dashboard comp */}
          {tab === 'dash' && <DashboardComp />}
          {/* Default to profile if no tab */}
          {!tab && <DashProfile />}
        </div>
      </div>
    </div>
  );
}