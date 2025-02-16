import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsLinkedin,  } from 'react-icons/bs';
export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
            >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-indigo-500 to-pink-500 rounded-lg text-white'>
              Engineering
            </span>
            Reference
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Engineering Reference
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Feedback Form' />
              <Footer.LinkGroup>
                <Footer.Link
                  href='https://rajsingh.notion.site/132b96f536f6808ea440fe275ba16348?pvs=105'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Write to us
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow us' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://github.com/rajsingho3'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link href='https://www.linkedin.com/in/raj-singh-/' target='blank'>LinkedIn</Footer.Link>
              </Footer.LinkGroup>
            </div>
            
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="Engineering Reference"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='https://www.linkedin.com/in/raj-singh-/'target='blank' icon={BsLinkedin}/>
            <Footer.Icon href='https://www.instagram.com/kshatriya_rajsingh_/'target='blank' icon={BsInstagram}/>
            <Footer.Icon href='https://x.com/Rajsingh7r' target='blank'icon={BsTwitter}/>
            <Footer.Icon href='https://github.com/rajsingho3'target='blank' icon={BsGithub}/>
            

          </div>
        </div>
      </div>
    </Footer>
  );
}