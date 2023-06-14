
import React from 'react';

const Feature = ({ imageSrc, title, description, imageClass, imageOnLeft }) => {
  return (
     <div className={`feature bg-gradient-to-r from-sky-400 via-sky-100 to-sky-400 border w-full h-66 justify-between border-gray-300 rounded-lg flex flex-col sm:flex-row items-center m-4 ${imageOnLeft ? 'sm:flex-row-reverse' : ''}`}>
  <img src={imageSrc} alt={title} className={imageClass} />
  <div className="flex flex-col m-4">
    <h3 className="text-xl font-extrabold text-[#212121]   ">{title}</h3>
    <p className=' text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-black  via-[#393838] to-[#000000] '>{description}</p>
  </div>
</div>
  );
};

const Features = ({ features, imageClass }) => {
  return (
    <div className="features text-center my-8">
      <div className="heading mb-8">
        <h2 className="text-4xl font-bold">Why Use Our Site?</h2>
      </div>
      <div className="flex flex-wrap justify-center">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} imageClass={imageClass} imageOnLeft={index % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

export default Features;