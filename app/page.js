import Features from '@/components/Features'
import Hero from '@/components/Hero'
import Testimonials from '@/components/Testimonial';


export default function Home() {
  const features = [
    {
      imageSrc: '/video.svg',
      title: 'Video Chat',
      description: 'Engage in live video conversations with native speakers of the language you want to learn. This feature enables users to practice their speaking and listening skills in a natural and interactive way.',
    },
    {
      imageSrc: '/build.svg',
      title: 'Language Matching',
      description: 'Connect with language partners who speak the language you want to learn and are interested in learning your native language. This feature ensures that users can find suitable language exchange partners based on their language preferences.',
    },
    {
      imageSrc: '/work.svg',
      title: 'User Profiles',
      description: 'Create personalized user profiles that showcase language you know, interests, and languages you want to learn. Profiles provide a way for users to learn more about each other and find compatible language partners.',
    },
    {
      imageSrc: '/messaging.svg',
      title: 'Messaging System',
      description: 'Communicate with your language exchange partners through an integrated messaging system. This feature allows users to coordinate language exchange sessions, share resources, and ask questions.',
    },
    {
      imageSrc: '/secure.svg',
      title: 'Privacy and Safety',
      description: 'Emphasize the importance of user privacy and safety by implementing secure user authentication, data encryption, and moderation systems to maintain a trustworthy environment.',
    }
  ];

  const testimonials = [
    {
      name: 'Testimonial 1',
      quote: 'This is a description of testimonial 1.',
      imageSrc: 'https://images.pexels.com/photos/16639180/pexels-photo-16639180/free-photo-of-man-playing-tennis-on-grass-court.jpeg',
    },
  ];
  return (
    <div id='container'>
      <div id='hero-section'>
        <Hero />
      </div>
      <div id='features-section'>
        <Features features={features} imageClass='w-full sm:w-64 h-64 rounded-xl md:mr-2' />
      </div>
      {/* <div id='testimonials-section'>
        <Testimonials testimonials={testimonials} />
      </div> */}


    </div>
  )
}
