import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative bg-gradient-to-br from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-xl border border-slate-600 h-[420px]'>
      <Link to={`/post/${post.slug}`}>
        <div className="relative overflow-hidden h-48">
          <img
            src={post.image}
            alt='post cover'
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800/50 to-transparent"></div>
        </div>
      </Link>
      <div className='p-6 flex flex-col justify-between h-[220px]'>
        <div>
          <h3 className='text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300'>
            {post.title}
          </h3>
          <span className='inline-block px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 mb-4'>
            {post.category}
          </span>
        </div>
        <div className="space-y-3">
          <div className="text-gray-400 text-sm">
            uncategorized
          </div>
          <Link
            to={`/post/${post.slug}`}
            className='block w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center transform group-hover:scale-105'
          >
            Read article
          </Link>
        </div>
      </div>
    </div>
  );
}