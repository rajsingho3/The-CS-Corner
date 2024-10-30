import React from 'react';
import { Link } from 'react-router-dom';


export default function signup() {
  return (
    <div className='min-h-screen mt-20'> 
    <div className=''>
      {/*left*/}
      <div className=''>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg text-white'>
        Engineering
        </span>
        Reference
        </Link>
      </div>
      {/*right*/}

    </div>
    </div>

    
  )
}
    