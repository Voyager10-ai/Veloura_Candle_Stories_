import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BorderGlow from './BorderGlow';
import './CustomerExperience.css';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  product: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    text: 'The Iced Latte Candle has completely transformed my living room. The scent is luxurious without being overwhelming — it fills the entire space with warmth.',
    rating: 5,
    product: 'Iced Latte Candle',
  },
  {
    id: 2,
    name: 'Arjun Patel',
    location: 'Bangalore, India',
    text: "I bought the Sage & Sea for my home office and I can't work without it now. The burn time is incredible — over 65 hours! Truly premium quality.",
    rating: 5,
    product: 'Sage & Sea',
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    location: 'Hyderabad, India',
    text: 'Gifted Rose & Blush to my mother and she absolutely loved it. The packaging is stunning and the candle itself is a work of art. Will be ordering more.',
    rating: 5,
    product: 'Rose & Blush',
  },
];

const CustomerExperience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from('.testimonials__header', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="testimonials" id="stories" ref={sectionRef}>
      <div className="testimonials__inner container">
        <div className="testimonials__header">
          <span className="section-label">Customer Stories</span>
          <h2 className="section-title">What Our Community Says</h2>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t, index) => (
            <BorderGlow
              key={t.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="testimonial-card"
              backgroundColor="rgba(255, 255, 255, 0.02)"
              borderRadius={16}
              glowColor={
                t.product === 'Iced Latte Candle' ? '33 70 52' :
                t.product === 'Sage & Sea' ? '39 45 60' : '39 51 79'
              }
              colors={
                t.product === 'Iced Latte Candle' ? ['#8B5A2B', '#C9A86A', '#F8F4EE'] :
                t.product === 'Sage & Sea' ? ['#C9A86A', '#E8D3A9', '#F8F4EE'] : ['#E8D3A9', '#C9A86A', '#F8F4EE']
              }
              glowRadius={40}
              glowIntensity={0.8}
              edgeSensitivity={25}
              coneSpread={30}
            >
              <div className="testimonial-card__stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="testimonial-card__star">★</span>
                ))}
              </div>
              <p className="testimonial-card__text">"{t.text}"</p>
              <div className="testimonial-card__footer">
                <div className="testimonial-card__avatar">
                  {t.name.charAt(0)}
                </div>
                <div className="testimonial-card__author">
                  <span className="testimonial-card__name">{t.name}</span>
                  <span className="testimonial-card__location">{t.location}</span>
                </div>
              </div>
              <div className="testimonial-card__product">
                Purchased: {t.product}
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerExperience;
