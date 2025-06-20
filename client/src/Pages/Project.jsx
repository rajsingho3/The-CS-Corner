
export default function Projects() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center py-20'>
      <div className='max-w-4xl mx-auto p-8 text-center'>
        <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-12 shadow-2xl border border-slate-600'>
          <div className='mb-8'>
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>
              <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent'>
                Projects
              </span>
            </h1>
            <p className='text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto'>
              Stay tuned for upcoming project uploads. We're working on exciting engineering projects 
              and tutorials that will be available soon.
            </p>
          </div>
          
          <div className='grid md:grid-cols-3 gap-6 mt-12'>
            <div className='bg-slate-700/50 rounded-2xl p-6 border border-slate-600'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                <span className='text-white font-bold'>🚀</span>
              </div>
              <h3 className='text-lg font-semibold text-white mb-2'>Web Applications</h3>
              <p className='text-gray-400 text-sm'>Full-stack projects with modern frameworks</p>
            </div>
            
            <div className='bg-slate-700/50 rounded-2xl p-6 border border-slate-600'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                <span className='text-white font-bold'>⚡</span>
              </div>
              <h3 className='text-lg font-semibold text-white mb-2'>API Development</h3>
              <p className='text-gray-400 text-sm'>RESTful APIs and microservices</p>
            </div>
            
            <div className='bg-slate-700/50 rounded-2xl p-6 border border-slate-600'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                <span className='text-white font-bold'>🎯</span>
              </div>
              <h3 className='text-lg font-semibold text-white mb-2'>Open Source</h3>
              <p className='text-gray-400 text-sm'>Contributing to the developer community</p>
            </div>
          </div>
          
          <div className='mt-12'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-6 py-3 rounded-full border border-purple-500/30'>
              <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse'></div>
              <span className='font-medium'>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}