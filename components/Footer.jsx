import React from 'react';

const Footer = () => {
  return (
    <footer className=" bg-sky-400 text-center ">
      <p>Made with ♥ by Ayush Kashyap</p>
    {/* technologies used */}
    <div>
      <p>Technology Used</p>
      <a href="https://appwrite.io/" target="_blank" rel="noreferrer" className="text-primary inline-block m-2"><div className="flex items-center gap-2"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M7.834 4C4.094 4.09.584 6.816.06 11.014a7.993 7.994 0 0 0 3.122 7.368c2.757 2.08 6.198 2.047 8.82.538a7.993 7.994 0 1 0-.005-13.834A7.84 7.84 0 0 0 7.831 4zm.122 1.485a6.525 6.526 0 0 1 6.484 5.537c0 .007.002.013.003.02.02.143.037.287.048.433l.006.054c.01.15.016.303.017.456 0 .084-.005.168-.008.252-.002.058-.003.117-.007.175a6.68 6.68 0 0 1-.03.335l-.01.08c-.015.12-.033.24-.055.358l-.01.048c-.022.124-.05.248-.08.37l-.006.025a6.578 6.58 0 0 1-.41 1.15c-.007.016-.017.033-.024.05a6.538 6.54 0 0 1-1.62 2.115l-.054.046c-.08.067-.162.13-.245.194-.055.042-.11.084-.168.125-.04.03-.08.056-.122.084a6.68 6.68 0 0 1-1.123.612 6.517 6.518 0 0 1-6.468-.8C.069 14.184.838 7.96 5.457 6.004a6.512 6.513 0 0 1 2.499-.518zm.61 3.72c-.183 0-.343.013-.352.032-.01.024-.132.504-.264 1.074-.136.57-.353 1.468-.475 2-.235.974-.377 1.613-.377 1.698 0 .023.146.042.325.042h.325l.146-.65.423-1.796c.15-.635.334-1.408.405-1.72.07-.31.14-.591.155-.624.014-.043-.066-.057-.31-.057zm-2.441 1.6-.438.47-.433.47.127.15c.07.086.264.298.428.472l.302.32h.856l-.405-.438c-.221-.235-.405-.46-.405-.49 0-.032.17-.243.377-.47.207-.23.376-.428.376-.45 0-.02-.178-.034-.395-.034zm3.27 0c-.231 0-.415.014-.415.028s.08.103.18.202c.366.367.624.678.61.74-.009.032-.188.253-.405.484l-.39.428h.437l.438-.005.4-.438c.22-.244.4-.46.4-.49 0-.023-.188-.244-.424-.493l-.423-.457z"></path></svg> <div className="hidden sm:inline-block"> Appwrite </div></div></a>
      <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" className="text-primary inline-block"><div className="flex items-center gap-2"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"></path></svg> <div className="hidden sm:inline-block"> Tailwind CSS </div></div></a>
      <a href='https://vercel.com/solutions/nextjs' target='_blank' rel="noreferrer" className="text-primary inline-block ml-2">
        <div className='inline-flex items-center gap-2'>
          <img src="https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.png" alt="Next.js" height="18px" width="18px" />
          <p className='hidden sm:inline-block'>Next.js</p>
        </div>
        
      </a>
    </div>
    </footer>
  );
};

export default Footer;