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
            You can signin with your email and password or with Google. <br />
          </p>
        </div>
        {/*right*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            
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
                placeholder='**********'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' className='w-full' disabled={loading}>
              {
                loading ? (
                  <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Dont have an account?</span>
            <Link to='/signup' className='text-blue-500'>
              Sign Up
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
