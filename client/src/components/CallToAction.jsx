export default function CallToAction() {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-600'>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>
              Want to learn more about{' '}
              <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
                MERN Stack Development?
              </span>
            </h2>
            <p className='text-gray-300 text-lg mb-6 leading-relaxed'>
              Use for Promoting pages or important things.
            </p>
            <button className='bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg'>
              <a href="" target='_blank' rel='noopener noreferrer'>
                Something you want to promote
              </a>
            </button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-teal-800 rounded-2xl p-6 transform -rotate-3 shadow-xl">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mx-auto mb-4 flex items-center justify-center transform rotate-12">
                      <span className="text-2xl font-bold text-white">JS</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">JavaScript</h3>
                    <div className="space-y-2 text-sm text-teal-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                        <span>Modern ES6+ Features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                        <span>Async/Await Patterns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                        <span>DOM Manipulation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}