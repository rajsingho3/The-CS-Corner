import { Button, Label, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function signup() {
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
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='Your Username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
              />
            </div>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='text'
                placeholder='name@company.com'
                id='Email'
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' className='w-full'>
              Sign Up
            </Button>
          </form>
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Have an account?</span>
            <Link to='/signin' className='text-blue-500'>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
