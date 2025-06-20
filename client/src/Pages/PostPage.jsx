import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          
          // Calculate estimated read time
          const words = data.posts[0].content.replace(/<[^>]*>/g, '').split(/\s+/).length;
          setEstimatedReadTime(Math.ceil(words / 200));
          
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=7`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('.post-content');
      if (article) {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        
        const progress = Math.min(
          100,
          Math.max(
            0,
            ((scrollTop + windowHeight - articleTop) / articleHeight) * 100
          )
        );
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  // Check bookmark status from localStorage
  useEffect(() => {
    if (post) {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(post._id));
    }
  }, [post]);

  const toggleBookmark = () => {
    if (!post) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let updatedBookmarks;
    
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter(id => id !== post._id);
    } else {
      updatedBookmarks = [...bookmarks, post._id];
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className='text-center'>
          <Spinner size='xl' className='mb-4' />
          <p className='text-gray-300'>Loading article...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white mb-4'>Article not found</h2>
          <p className='text-gray-300 mb-6'>The article you're looking for doesn't exist.</p>
          <Link to='/' className='bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300'>
            Go Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Reading Progress Bar */}
      <div 
        className='fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 z-50 transition-all duration-300'
        style={{ width: `${readingProgress}%` }}
      />

      {/* Floating Action Buttons */}
      <div className='fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-3'>
        <button
          onClick={toggleBookmark}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            isBookmarked 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' 
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
        >
          <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        
        <button
          onClick={sharePost}
          className='p-3 rounded-full bg-slate-700 text-gray-300 hover:bg-slate-600 shadow-lg transition-all duration-300'
          title='Share article'
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      </div>

      <main className='max-w-5xl mx-auto px-6 py-12'>
        {/* Hero Section */}
        <article className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl overflow-hidden shadow-2xl border border-slate-600'>
          {/* Header */}
          <div className='p-8 md:p-12'>
            <div className='mb-6'>
              <Link
                to={`/search?category=${post && post.category}`}
                className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-300 hover:text-purple-200 transition-all duration-300 text-sm font-medium'
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {post && post.category}
              </Link>
            </div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
              {post && post.title}
            </h1>

            {/* Article Meta */}
            <div className='flex flex-wrap items-center gap-6 text-gray-300 mb-8'>
              <div className='flex items-center space-x-2'>
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{post && new Date(post.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className='flex items-center space-x-2'>
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{estimatedReadTime} min read</span>
              </div>

              <div className='flex items-center space-x-2'>
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{Math.floor(Math.random() * 500) + 100} views</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post && post.image && (
            <div className='relative group'>
              <img
                src={post.image}
                alt={post.title}
                className='w-full h-96 md:h-[500px] object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105'
                onClick={() => window.open(post.image, '_blank')}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-6'>
                <button 
                  onClick={() => window.open(post.image, '_blank')}
                  className='bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-black/70 transition-all duration-300'
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span>View Full Size</span>
                </button>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className='p-8 md:p-12'>
            <div
              className='prose prose-invert prose-lg max-w-none post-content prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-em:text-gray-300 prose-code:text-purple-300 prose-code:bg-slate-800 prose-pre:bg-slate-800 prose-blockquote:border-l-purple-500 prose-blockquote:text-gray-300'
              dangerouslySetInnerHTML={{ __html: post && post.content }}
            />
          </div>
        </article>

        {/* Call to Action */}
        <div className='mt-12'>
          <CallToAction />
        </div>

        {/* Comment Section */}
        <div className='mt-12'>
          <CommentSection postId={post && post._id} />
        </div>

        {/* Recent Articles */}
        <div className='mt-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
              More{' '}
              <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent'>
                Articles
              </span>
            </h2>
            <p className='text-gray-300 text-lg'>Discover more insightful content</p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {recentPosts &&
              recentPosts
                .filter(recentPost => recentPost._id !== post._id) // Exclude current post
                .slice(0, 6) // Show max 6 posts
                .map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
          </div>
        </div>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        .post-content iframe[type="application/pdf"] {
          width: 100%;
          min-height: 500px;
          border: 1px solid #64748b;
          border-radius: 12px;
          background: #475569;
        }
        .pdf-controls {
          margin: 16px 0;
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .pdf-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .pdf-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        }
        .prose img {
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .prose blockquote {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }
        .prose code:not(pre code) {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.875em;
        }
        .prose pre {
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #64748b;
        }
      `}</style>
    </div>
  );
}