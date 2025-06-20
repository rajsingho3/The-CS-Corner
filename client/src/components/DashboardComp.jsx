import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiArrowNarrowUp,
  HiDocumentText,
  HiUsers,
  HiEye,
  HiChatAlt,
  HiTrendingUp,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          fetch('/api/user/getusers?limit=5'),
          fetch('/api/post/getposts?limit=5'),
          fetch('/api/comment/getcomments?limit=5')
        ]);

        if (usersRes.ok) {
          const userData = await usersRes.json();
          setUsers(userData.users);
          setTotalUsers(userData.totalUsers);
          setLastMonthUsers(userData.lastMonthUsers);
        }

        if (postsRes.ok) {
          const postData = await postsRes.json();
          setPosts(postData.posts);
          setTotalPosts(postData.totalPosts);
          setLastMonthPosts(postData.lastMonthPosts);
        }

        if (commentsRes.ok) {
          const commentData = await commentsRes.json();
          setComments(commentData.comments);
          setTotalComments(commentData.totalComments);
          setLastMonthComments(commentData.lastMonthComments);
        }
      } catch (error) {
        console.log('Error fetching dashboard data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchData();
    } else {
      // For non-admin users, just fetch their own posts
      const fetchUserPosts = async () => {
        try {
          const res = await fetch('/api/post/getposts?limit=5');
          if (res.ok) {
            const data = await res.json();
            setPosts(data.posts);
            setTotalPosts(data.totalPosts);
            setLastMonthPosts(data.lastMonthPosts);
          }
        } catch (error) {
          console.log('Error fetching user posts:', error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserPosts();
    }
  }, [currentUser]);

  const StatCard = ({ title, value, lastMonth, icon: Icon, color, trend }) => (
    <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='text-gray-300 text-sm font-medium uppercase tracking-wide'>{title}</h3>
          <p className='text-3xl font-bold text-white mt-2'>{value.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className='text-2xl text-white' />
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <HiArrowNarrowUp className={`${trend < 0 ? 'rotate-180' : ''}`} />
          <span>{Math.abs(lastMonth)}</span>
        </div>
        <span className='text-gray-400 text-sm'>from last month</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-96'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Welcome Section */}
      <div className='bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6'>
        <h2 className='text-2xl font-bold text-white mb-2'>
          Welcome back, {currentUser?.username}! 👋
        </h2>
        <p className='text-gray-300'>
          {currentUser?.isAdmin 
            ? "Here's an overview of your platform's performance" 
            : "Here's an overview of your content performance"
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='Total Posts'
          value={totalPosts}
          lastMonth={lastMonthPosts}
          icon={HiDocumentText}
          color='bg-gradient-to-r from-blue-500 to-blue-600'
          trend={lastMonthPosts}
        />
        
        {currentUser?.isAdmin && (
          <>
            <StatCard
              title='Total Users'
              value={totalUsers}
              lastMonth={lastMonthUsers}
              icon={HiUsers}
              color='bg-gradient-to-r from-green-500 to-green-600'
              trend={lastMonthUsers}
            />
            
            <StatCard
              title='Total Comments'
              value={totalComments}
              lastMonth={lastMonthComments}
              icon={HiChatAlt}
              color='bg-gradient-to-r from-purple-500 to-purple-600'
              trend={lastMonthComments}
            />
          </>
        )}
        
        <StatCard
          title='Total Views'
          value={Math.floor(Math.random() * 10000) + 5000}
          lastMonth={Math.floor(Math.random() * 500) + 100}
          icon={HiEye}
          color='bg-gradient-to-r from-orange-500 to-orange-600'
          trend={Math.floor(Math.random() * 500) + 100}
        />
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Recent Posts */}
        <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-600 overflow-hidden'>
          <div className='p-6 border-b border-slate-600'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl font-bold text-white flex items-center'>
                <HiDocumentText className='mr-2 text-blue-400' />
                Recent Posts
              </h3>
              <Link 
                to='/dashboard?tab=posts'
                className='bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium'
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className='p-6'>
            {posts.length > 0 ? (
              <div className='space-y-4'>
                {posts.map((post) => (
                  <div key={post._id} className='flex items-center space-x-4 p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors'>
                    <img
                      src={post.image || '/api/placeholder/60/40'}
                      alt={post.title}
                      className='w-16 h-12 rounded-lg object-cover border border-slate-600'
                    />
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-white font-medium truncate'>{post.title}</h4>
                      <div className='flex items-center space-x-4 mt-1'>
                        <span className='text-purple-400 text-sm px-2 py-1 bg-purple-500/20 rounded-full'>
                          {post.category}
                        </span>
                        <span className='text-gray-400 text-sm'>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <HiDocumentText className='mx-auto text-4xl text-gray-500 mb-4' />
                <p className='text-gray-400'>No posts yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users or Comments */}
        {currentUser?.isAdmin ? (
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-600 overflow-hidden'>
            <div className='p-6 border-b border-slate-600'>
              <h3 className='text-xl font-bold text-white flex items-center'>
                <HiUsers className='mr-2 text-green-400' />
                Recent Users
              </h3>
            </div>
            
            <div className='p-6'>
              {users.length > 0 ? (
                <div className='space-y-4'>
                  {users.map((user) => (
                    <div key={user._id} className='flex items-center space-x-4 p-4 bg-slate-700/50 rounded-xl'>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className='w-12 h-12 rounded-full border-2 border-slate-600'
                      />
                      <div className='flex-1'>
                        <h4 className='text-white font-medium'>{user.username}</h4>
                        <p className='text-gray-400 text-sm'>{user.email}</p>
                      </div>
                      {user.isAdmin && (
                        <span className='bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs'>
                          Admin
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <HiUsers className='mx-auto text-4xl text-gray-500 mb-4' />
                  <p className='text-gray-400'>No users yet</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-600 p-6'>
            <h3 className='text-xl font-bold text-white mb-6 flex items-center'>
              <HiTrendingUp className='mr-2 text-purple-400' />
              Quick Actions
            </h3>
            
            <div className='space-y-4'>
              <Link 
                to='/create-post'
                className='block w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-4 rounded-xl transition-all duration-300 text-center font-medium'
              >
                Create New Post
              </Link>
              
              <Link 
                to='/dashboard?tab=posts'
                className='block w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl transition-all duration-300 text-center font-medium'
              >
                Manage Posts
              </Link>
              
              <Link 
                to='/dashboard?tab=profile'
                className='block w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl transition-all duration-300 text-center font-medium'
              >
                Edit Profile
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Activity Chart Placeholder */}
      <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-600 p-6'>
        <h3 className='text-xl font-bold text-white mb-6 flex items-center'>
          <HiTrendingUp className='mr-2 text-orange-400' />
          Activity Overview
        </h3>
        
        <div className='h-64 bg-slate-700/50 rounded-xl flex items-center justify-center'>
          <div className='text-center'>
            <HiTrendingUp className='mx-auto text-6xl text-gray-500 mb-4' />
            <p className='text-gray-400 text-lg font-medium'>Analytics Chart</p>
            <p className='text-gray-500 text-sm'>Coming soon with detailed insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}