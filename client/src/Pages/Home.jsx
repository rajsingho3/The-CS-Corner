import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/post/getPosts');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('API Response:', data); // Debug log
        
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          console.error('Invalid data structure:', data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className='flex flex-col items-center justify-center gap-8 pt-32 pb-20 px-6 max-w-6xl mx-auto text-center'>
        <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight'>
          Welcome to{' '}
          <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent'>
            Engineering
          </span>
          <br />
          <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent'>
            Reference
          </span>
        </h1>
        <p className='text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed'>
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to='/search'
          className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg'
        >
          View all posts
        </Link>
      </div>      {/* Call to Action Section */}
      <div className='py-16 px-6'>
        <CallToAction />
      </div>

      {/* PYQ Papers Section */}
      <div className='max-w-7xl mx-auto px-6 py-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
            Previous Year <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>Question Papers</span>
          </h2>
          <p className='text-gray-300 text-lg max-w-3xl mx-auto'>
            Access a comprehensive collection of previous year question papers organized by course, semester, and year.
          </p>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-3xl shadow-2xl border border-slate-600 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105'>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Organized by Semester</h3>
              <p className='text-gray-300'>
                Find papers organized by semester and year for easy navigation and study planning.
              </p>
            </div>
          </div>
          
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-3xl shadow-2xl border border-slate-600 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105'>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Multiple Formats</h3>
              <p className='text-gray-300'>
                Access papers in various formats including PDF, DOC, and image files for convenience.
              </p>
            </div>
          </div>
          
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-3xl shadow-2xl border border-slate-600 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105'>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Verified Content</h3>
              <p className='text-gray-300'>
                All papers are verified and approved by our team to ensure quality and authenticity.
              </p>
            </div>
          </div>
        </div>
        
        <div className='text-center'>
          <Link
            to='/pyq-browser'
            className='bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg'
          >
            Browse PYQ Papers
          </Link>
        </div>
      </div>{/* Recent Posts Section */}
      <div className='max-w-7xl mx-auto px-6 py-16'>
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="text-gray-300 mt-4">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-400 mb-4">Error loading posts: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
            >
              Retry
            </button>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className='flex flex-col gap-12'>
            <div className="text-center">
              <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                Recent <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>Posts</span>
              </h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to={'/search'}
                className='inline-flex items-center text-lg text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-300'
              >
                View all posts
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-12 shadow-2xl border border-slate-600">
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>
                No Posts Yet
              </h2>
              <p className="text-gray-300 mb-6">
                There are no posts available at the moment. Check back later for new content!
              </p>
              <Link
                to="/search"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Explore More
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}