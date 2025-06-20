import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { set } from 'mongoose';
import { useDispatch, useSelector } from 'react-redux';
import { signinSuccess,signinFailure,signinStart } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


export default function Signin() {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage, user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signinFailure('Please fill in all fields.'));
      
    }
    try {
      dispatch(signinStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }); 
      const data = await res.json();
      if (data.success === false) {
         dispatch(signinFailure(data.message));
        
      }
      
      if (res.ok) {
        dispatch(signinSuccess(data));
        navigate('/');
        
      }
      
    } catch (error) {
      // Handle error here
      dispatch(signinFailure(error.message));
    }
  }

    return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute top-0 left-0 w-full h-full'>
        <div className='absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
        <div className='absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
      </div>      <div className='relative z-10 flex items-center justify-center min-h-screen p-3'>
        <div className='w-full max-w-5xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-8 items-center'>
            {/* Left side - Welcome content */}
            <div className='hidden lg:block space-y-5 animate-fade-in-left'>
              <div className='text-center lg:text-left'>
                <Link to='/' className='inline-block group'>
                  <h1 className='text-3xl xl:text-4xl font-bold mb-4 transition-transform group-hover:scale-105'>
                    <span className='px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white shadow-2xl inline-block transform hover:shadow-3xl transition-all duration-300'>
                      Engineering
                    </span>
                    <br className='mb-1' />
                    <span className='text-gray-800 dark:text-gray-200 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400'>
                      Reference
                    </span>
                  </h1>
                </Link>
                <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-5'>
                  Join the future of engineering education and collaboration
                </p>
              </div>
              
              <div className='space-y-4'>
                {[
                  { icon: '🚀', title: 'Premium Resources', desc: 'Access curated study materials and cutting-edge engineering resources' },
                  { icon: '🔧', title: 'Smart Tools', desc: 'Leverage AI-powered tools to enhance your learning journey' },
                  { icon: '📜', title: 'Exam Prep', desc: 'Download comprehensive past papers and practice materials' },
                  { icon: '👥', title: 'Global Network', desc: 'Connect with engineers worldwide and share knowledge' }
                ].map((item, index) => (
                  <div key={index} className='flex items-start space-x-3 p-3 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 group'>
                    <div className='text-2xl group-hover:scale-110 transition-transform duration-300'>{item.icon}</div>
                    <div>
                      <h3 className='text-base font-semibold text-gray-800 dark:text-gray-200 mb-1'>{item.title}</h3>
                      <p className='text-sm text-gray-600 dark:text-gray-300'>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Sign in card */}
            <div className='w-full max-w-sm mx-auto animate-fade-in-right'>
              <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden hover:shadow-3xl transition-all duration-500'>
                {/* Card header */}
                <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-6 relative overflow-hidden'>
                  <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent'></div>
                  <div className='relative z-10 text-center'>
                    <div className='mb-3'>
                      <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm'>
                        <span className='text-xl'>👋</span>
                      </div>
                    </div>
                    <h2 className='text-2xl font-bold text-white mb-1'>Welcome Back!</h2>
                    <p className='text-white/90 text-base'>Sign in to continue your journey</p>
                  </div>
                </div>

                {/* Card body */}
                <div className='px-6 py-6'>                  <form className='space-y-4' onSubmit={handleSubmit}>
                    <div className='space-y-1'>
                      <Label value='Email Address' className='text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider' />
                      <div className='relative group'>
                        <TextInput
                          type='email'
                          placeholder='Enter your email'
                          id='email'
                          onChange={handleChange}
                          className='w-full'
                          sizing='md'
                        />
                        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                      </div>
                    </div>
                    
                    <div className='space-y-1'>
                      <Label value='Password' className='text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider' />
                      <div className='relative group'>
                        <TextInput
                          type='password'
                          placeholder='Enter your password'
                          id='password'
                          onChange={handleChange}
                          className='w-full'
                          sizing='md'
                        />
                        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                      </div>
                    </div>

                    <div className='flex items-center justify-between text-xs'>
                      <label className='flex items-center'>
                        <input type='checkbox' className='rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' />
                        <span className='ml-2 text-gray-600 dark:text-gray-400'>Remember me</span>
                      </label>
                      <Link to='/forgot-password' className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors'>
                        Forgot password?
                      </Link>
                    </div>

                    <Button 
                      gradientDuoTone='purpleToPink' 
                      type='submit' 
                      className='w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl' 
                      size='md'
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size='sm'/>
                          <span className='ml-2'>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                          </svg>
                        </>
                      )}
                    </Button>

                    <div className='relative my-5'>
                      <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent'></div>
                      </div>
                      <div className='relative flex justify-center text-xs'>
                        <span className='px-3 bg-white dark:bg-gray-800 text-gray-500 font-medium'>Or continue with</span>
                      </div>
                    </div>

                    <OAuth />
                  </form>

                  {errorMessage && (
                    <div className='mt-4 animate-shake'>
                      <Alert className='border-0 bg-red-50 dark:bg-red-900/20' color='failure'>
                        <span className='font-medium'>Error!</span> {errorMessage}
                      </Alert>
                    </div>
                  )}

                  <div className='mt-5 text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg'>
                    <span className='text-gray-600 dark:text-gray-400 text-sm'>Don't have an account? </span>
                    <Link to='/signup' className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors duration-300 hover:underline text-sm'>
                      Sign Up Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
