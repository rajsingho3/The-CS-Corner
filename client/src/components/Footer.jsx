import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsLinkedin } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <footer className='bg-slate-900 border-t border-slate-700'>
      <div className='w-full max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='md:col-span-1'>
            <Link to='/' className='flex items-center gap-2 mb-4'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold'>ER</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-white font-bold text-lg'>Engineering</span>
                <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-bold'>Reference</span>
              </div>
            </Link>
            <p className='text-gray-400 text-sm leading-relaxed'>
              Engineering Reference provides comprehensive articles and tutorials on web development, software engineering, and programming languages.
            </p>
          </div>
          
          <div>
            <h3 className='text-white font-semibold mb-4'>About</h3>
            <div className='space-y-2'>
              <Link to='/about' className='block text-gray-400 hover:text-purple-400 transition-colors text-sm'>
                Engineering Reference
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className='text-white font-semibold mb-4'>Feedback Form</h3>
            <div className='space-y-2'>
              <a 
                href='https://rajsingh.notion.site/132b96f536f6808ea440fe275ba16348?pvs=105'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-gray-400 hover:text-purple-400 transition-colors text-sm'
              >
                Write to us
              </a>
            </div>
          </div>
          
          <div>
            <h3 className='text-white font-semibold mb-4'>Follow us</h3>
            <div className='space-y-2'>
              <a 
                href='https://github.com/rajsingho3'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-gray-400 hover:text-purple-400 transition-colors text-sm'
              >
                Github
              </a>
              <a 
                href='https://www.linkedin.com/in/raj-singh-/'
                target='_blank'
                rel='noopener noreferrer'
                className='block text-gray-400 hover:text-purple-400 transition-colors text-sm'
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        
        <div className='border-t border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center'>
          <p className='text-gray-400 text-sm'>
            © {new Date().getFullYear()} Engineering Reference. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a 
              href='https://www.linkedin.com/in/raj-singh-/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-purple-400 transition-colors'
            >
              <BsLinkedin className="text-xl" />
            </a>
            <a 
              href='https://www.instagram.com/kshatriya_rajsingh_/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-purple-400 transition-colors'
            >
              <BsInstagram className="text-xl" />
            </a>
            <a 
              href='https://x.com/Rajsingh7r'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-purple-400 transition-colors'
            >
              <BsTwitter className="text-xl" />
            </a>
            <a 
              href='https://github.com/rajsingho3'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-purple-400 transition-colors'
            >
              <BsGithub className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}