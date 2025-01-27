import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import OtpVerify from './OtpVerify'; // Import OtpVerify component

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOtpVerify, setShowOtpVerify] = useState(false); // State to control OTP verification page
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill in all fields');
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return setErrorMessage('Please enter a valid email address');
    }
    if (formData.password.length < 8) {
      return setErrorMessage('Password must be at least 8 characters long and contain a mix of letters, numbers, and special characters');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        // Pass email to OTP component
        localStorage.setItem('tempEmail', formData.email);
        setShowOtpVerify(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  if (showOtpVerify) {
    return <OtpVerify email={formData.email} />; // Render OTP verification page
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-7'>
        {/*left*/}
        <div className='flex-1'>
          <Link to='/' className='font-bold text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg text-white'>
              Engineering
            </span>
            Reference
          </Link>
          <p className='text-sm mt-5'>
            This is a blog page for engineers to share their knowledge and experience. <br />
            You can also find useful resources and tools here. <br />
            You can signup with your email and password or with Google. <br />
          </p>
        </div>
        {/*right*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' className='w-full' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign up'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Have an account?</span>
            <Link to='/signin' className='text-blue-500'>
              Sign in
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  );
}
