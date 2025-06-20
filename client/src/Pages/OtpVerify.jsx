import React, { useState, useEffect } from "react";
import { Button, TextInput, Label, Alert, Spinner } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';

function OtpVerify({ email }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes countdown
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setErrorMessage("Please enter all 6 digits");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: localStorage.getItem('tempEmail'), 
          otp: otpString 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const data = await response.json();
      localStorage.removeItem('tempEmail');
      navigate('/signin');
      
    } catch (error) {
      setErrorMessage(error.message);
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: localStorage.getItem('tempEmail')
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend OTP');
      }

      setTimer(300);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById('otp-0')?.focus();
      
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute top-0 left-0 w-full h-full'>
        <div className='absolute top-20 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
        <div className='absolute top-40 right-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-8 left-40 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative z-10 flex items-center justify-center min-h-screen p-3'>
        <div className='w-full max-w-md mx-auto animate-fade-in-up'>
          <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden hover:shadow-3xl transition-all duration-500'>
            {/* Card header */}
            <div className='bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-8 relative overflow-hidden'>
              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent'></div>
              <div className='relative z-10 text-center'>
                <div className='mb-4'>
                  <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm'>
                    <span className='text-2xl'>📧</span>
                  </div>
                </div>
                <h2 className='text-2xl font-bold text-white mb-2'>Verify Your Email</h2>
                <p className='text-white/90 text-sm leading-relaxed'>
                  We've sent a 6-digit verification code to<br />
                  <span className='font-semibold'>{localStorage.getItem('tempEmail')}</span>
                </p>
              </div>
            </div>

            {/* Card body */}
            <div className='px-6 py-8'>
              <div className='space-y-6'>
                {/* OTP Input Grid */}
                <div className='space-y-3'>
                  <Label value='Enter Verification Code' className='text-gray-700 dark:text-gray-300 font-semibold text-sm text-center block' />
                  <div className='flex justify-center space-x-3'>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type='text'
                        inputMode='numeric'
                        pattern='[0-9]*'
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className='w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-blue-400'
                      />
                    ))}
                  </div>
                </div>

                {/* Timer */}
                <div className='text-center'>
                  {!canResend ? (
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Code expires in{' '}
                      <span className='font-semibold text-blue-600 dark:text-blue-400'>
                        {formatTime(timer)}
                      </span>
                    </p>
                  ) : (
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Didn't receive the code?
                    </p>
                  )}
                </div>

                {/* Verify Button */}
                <Button 
                  gradientDuoTone='cyanToBlue' 
                  onClick={handleVerify}
                  className='w-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl' 
                  size='lg'
                  disabled={loading || otp.join("").length !== 6}
                >
                  {loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='ml-2'>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <svg className='w-5 h-5 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </>
                  )}
                </Button>

                {/* Resend Button */}
                {canResend && (
                  <Button 
                    color='gray'
                    onClick={handleResend}
                    className='w-full transform hover:scale-105 transition-all duration-300' 
                    size='md'
                    disabled={loading}
                    outline
                  >
                    {loading ? (
                      <>
                        <Spinner size='sm' />
                        <span className='ml-2'>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Resend Code</span>
                        <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                        </svg>
                      </>
                    )}
                  </Button>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className='animate-shake'>
                    <Alert className='border-0 bg-red-50 dark:bg-red-900/20' color='failure'>
                      <div className='flex items-center'>
                        <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                        </svg>
                        <span className='font-medium'>{errorMessage}</span>
                      </div>
                    </Alert>
                  </div>
                )}

                {/* Help Section */}
                <div className='text-center space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                  <div className='space-y-2'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Having trouble? Check your spam folder or
                    </p>
                    <Link 
                      to='/support' 
                      className='text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline transition-colors'
                    >
                      Contact Support
                    </Link>
                  </div>
                  
                  <Link 
                    to='/signup' 
                    className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium transition-colors hover:underline block'
                  >
                    ← Back to Sign Up
                  </Link>
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
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
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

export default OtpVerify;
