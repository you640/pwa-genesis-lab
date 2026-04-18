import React from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Marcus "The Titan" Cole',
    title: 'Pro Powerlifter',
    quote: "The Forge isn't just a brand; it's a creed. Their pre-workout is the only thing that gets me through 1,000lb squat sessions. Pure, raw power. No fluff.",
    imageUrl: 'https://i.pravatar.cc/150?u=marcus',
  },
  {
    id: 2,
    name: 'Elena Petrova',
    title: 'IFBB Wellness Pro',
    quote: 'As a wellness competitor, purity is everything. The quality of their isolates is unmatched. Clean gains, perfect for my prep and my off-season.',
    imageUrl: 'https://i.pravatar.cc/150?u=elena',
  },
  {
    id: 3,
    name: 'Javier "El Martillo" Rojas',
    title: 'Strongman Competitor',
    quote: "I break my body down daily. Their joint support and recovery stacks are the glue that holds me together. Without The Forge, I couldn't do what I do.",
    imageUrl: 'https://i.pravatar.cc/150?u=javier',
  },
];

export const TestimonialsSection: React.FC = React.memo(() => {
  return (
    <section className="bg-black py-16 sm:py-24" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          id="testimonials-heading" 
          className="font-teko text-5xl md:text-6xl font-bold text-center uppercase text-lime-400"
        >
          Echoes from the Anvil
        </h2>
        <p className="mt-2 text-lg text-slate-400 max-w-3xl mx-auto text-center">
          Forged in sweat and iron. Hear from the legion who trust our gear in their pursuit of greatness.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:border-lime-500/50 hover:shadow-2xl hover:shadow-lime-500/10"
            >
              <svg className="absolute top-4 right-4 w-24 h-24 text-slate-800/50 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15.674 3 14.569c0-1.835 1.41-3.266 3.23-3.266 1.82 0 3.23 1.431 3.23 3.266 0 1.104-.552 1.657-1.582 2.751L6.05 19h2.158c.848 0 1.53.682 1.53 1.53s-.682 1.53-1.53 1.53H4.03C3.182 22.06 2.5 21.378 2.5 20.53c0-1.102.68-2.655 1.542-3.666l.541-.643zM15.583 17.321c-1.03-1.094-1.582-1.647-1.582-2.751 0-1.835 1.41-3.266 3.23-3.266 1.82 0 3.23 1.431 3.23 3.266 0 1.104-.552 1.657-1.582 2.751L17.05 19h2.158c.848 0 1.53.682 1.53 1.53s-.682 1.53-1.53 1.53H15.03c-.848 0-1.53-.682-1.53-1.53 0-1.102.68-2.655 1.542-3.666l.541-.643z"></path>
              </svg>
              <div className="relative z-10">
                <blockquote className="italic text-slate-300">
                  <p>"{testimonial.quote}"</p>
                </blockquote>
                <div className="mt-4 flex items-center">
                  <img className="h-12 w-12 rounded-full object-cover" src={testimonial.imageUrl} alt={testimonial.name} loading="lazy" decoding="async" />
                  <div className="ml-4">
                    <div className="text-base font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-lime-400">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});