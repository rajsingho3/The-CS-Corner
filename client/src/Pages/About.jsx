export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About Engineering Reference
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
            Welcome to Engineering Reference, your go-to resource for all things engineering. <br />
            Explore a Comprehensive collection of engineering articles, tutorials, and reference materials. <br />
             Join our community of engineers and learn together.
            </p>

            <p>
              On this page , you'll find weekly articles and tutorials on topics
              such as web development, software engineering, and programming
              languages. We also cover topics like data structures and algorithms,
            </p>

            <blockquote className='border-l-4 border-gray-300 pl-4 italic text-white text-2xl'>
              The process is more important than the results. And if you take care of the process, you will get the results

            </blockquote>
            <p > MS Dhoni</p>
          </div>
        </div>
      </div>
    </div>
  );
}