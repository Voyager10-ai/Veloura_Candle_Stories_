import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlowingMenu from './FlowingMenu';

import saffronImg from '../assets/images/saffron.png';
import lemongrassImg from '../assets/images/lemongrass.png';
import lavenderImg from '../assets/images/lavender.png';
import sandalwoodImg from '../assets/images/sandalwood.png';

import './ActivationsSection.css';

gsap.registerPlugin(ScrollTrigger);

const masterpieceItems = [
  { 
    link: '#shop', 
    text: 'Saffron', 
    image: saffronImg, 
    marqueeBgColor: '#D98E32', // Soft Amber
    marqueeTextColor: '#121212' 
  },
  { 
    link: '#shop', 
    text: 'Lemongrass', 
    image: lemongrassImg, 
    marqueeBgColor: '#C9A86A', // Antique Gold
    marqueeTextColor: '#121212' 
  },
  { 
    link: '#shop', 
    text: 'Lavender', 
    image: lavenderImg, 
    marqueeBgColor: '#E8D3A9', // Champagne Gold
    marqueeTextColor: '#121212' 
  },
  { 
    link: '#shop', 
    text: 'Sandalwood', 
    image: sandalwoodImg, 
    marqueeBgColor: '#C9A86A', // Antique Gold
    marqueeTextColor: '#121212' 
  }
];

const ActivationsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.activations__header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // FlowingMenu items stagger entrance
      gsap.from('.menu__item', {
        y: 45,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="activations" id="collaborations" ref={sectionRef}>
      <div className="activations__inner container">
        <div className="activations__header">
          <span className="section-label">Masterpieces</span>
          <h2 className="activations__title">Signature Fragrances</h2>
          <p className="activations__subtitle">
            Experience our four most sought-after luxury blends, handcrafted to perfection.
          </p>
        </div>

        <div className="activations__menu-container">
          <FlowingMenu 
            items={masterpieceItems}
            speed={12}
            textColor="#F8F4EE"
            bgColor="#121212"
            borderColor="rgba(255, 255, 255, 0.08)"
          />
        </div>
      </div>
    </section>
  );
};

export default ActivationsSection;
