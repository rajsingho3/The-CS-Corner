export default function About() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-20'>
      <div className='max-w-4xl mx-auto p-8'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>
            About{' '}
            <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent'>
              Engineering Reference
            </span>
          </h1>
        </div>
        
        <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-600'>
          <div className='space-y-8 text-gray-300 text-lg leading-relaxed'>
            <p className='text-xl'>
              Welcome to{' '}
              <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold'>
                Engineering Reference
              </span>
              , your go-to resource for all things engineering.
            </p>
            
            <p>
              Explore a comprehensive collection of engineering articles, tutorials, and reference materials. 
              Join our community of engineers and learn together as we dive deep into the latest technologies 
              and best practices in software development.
            </p>

            <p>
              On this platform, you'll find weekly articles and tutorials on topics such as web development, 
              software engineering, and programming languages. We also cover advanced topics like data 
              structures and algorithms, system design, and emerging technologies.
            </p>

            <div className='bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 p-6 rounded-lg my-8'>
              <blockquote className='text-white text-xl md:text-2xl font-medium italic mb-4'>
                "The process is more important than the results. And if you take care of the process, you will get the results."
              </blockquote>
              <p className='text-purple-300 font-semibold'>— MS Dhoni</p>
            </div>
            
            <div className='grid md:grid-cols-2 gap-8 mt-12'>
              <div className='space-y-4'>
                <h3 className='text-2xl font-bold text-white mb-4'>What We Cover</h3>
                <ul className='space-y-2'>
                  <li className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                    <span>Web Development</span>
                  </li>
                  <li className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                    <span>Software Engineering</span>
                  </li>
                  <li className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                    <span>Programming Languages</span>
                  </li>
                  <li className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                    <span>Data Structures & Algorithms</span>
                  </li>
                </ul>
              </div>
              
              <div className='space-y-4'>
                <h3 className='text-2xl font-bold text-white mb-4'>Our Mission</h3>
                <p className='text-gray-300'>
                  To provide high-quality, accessible engineering content that helps developers 
                  grow their skills and advance their careers in technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}