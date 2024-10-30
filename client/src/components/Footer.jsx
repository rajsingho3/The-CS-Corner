import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import React from 'react';

export default function FooterCom() {
  return (
    <Footer container className='border-t-8 border-teal-500'>
        <div>
            <div>
                <div className=''>
                <Link to='/'
                 className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg text-white'>
          Engineering
        </span>
        Reference
      </Link>
                </div>
                <div className='grid grid-cols-2 gap-3 sm: mt-4 sm:grid-cols-3 sm:gap-6'>
                    <Footer.Title title='About' />
                    <Footer.LinkGroup col>
                        <Footer.Link
                            href='/about'
                            target='_blank'
                            rel='noopener noreferrer'
                            >
                                100js 
                        </Footer.Link>
                    </Footer.LinkGroup>

                </div>
                <Footer.Divider />
                <div className=''>
                    <Footer.Copyright href='#' by='Engineering Reference' year={new Date().getFullYear()}/>
                </div>
            </div>
        </div>
        </Footer>
  )
}
