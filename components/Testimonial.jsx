import React from 'react';

const Testimonial = ({ imageSrc, name, quote }) => {
  return (
    <div className="testimonial flex flex-col items-center mx-4">
      <img src={imageSrc} alt={name} className="w-32 h-32 rounded-full" />
      <h3 className="text-lg font-semibold mt-4">{name}</h3>
      <p className="text-center mt-2 italic">"{quote}"</p>
    </div>
  );
};

const Testimonials = ({ testimonials }) => {
  return (
    <div className="testimonials text-center my-8">
      <div className="heading mb-8">
        <h2 className="text-2xl font-bold">What our users saying?</h2>
      </div>
      <div className="flex flex-wrap justify-center">
        {testimonials.map((testimonial) => (
          <Testimonial key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
