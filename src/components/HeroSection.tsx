import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from './MagneticButton';
import ScrollFloat from './ScrollFloat';
import heroCandle from '../assets/images/hero-candle.png';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;

    if (!section || !content || !image) return;

    const ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.6 });

      // Badge
      tl.from('.hero__badge', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });

      // Title words
      tl.from(
        '.hero__title-line',
        {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // Subtitle
      tl.from(
        '.hero__subtitle',
        {
          y: 25,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      );

      // CTA buttons
      tl.from(
        '.hero__actions .magnetic-btn',
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // Feature pills
      tl.from(
        '.hero__feature',
        {
          y: 15,
          opacity: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power3.out',
        },
        '-=0.2'
      );

      // Product image
      tl.from(
        image,
        {
          x: 80,
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: 'power3.out',
        },
        0.8
      );

      // Glow pulse
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.15,
          opacity: 0.6,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Note: ScrollFloat handles scroll animations for hero title lines
      // Image parallax on scroll
      gsap.to(image, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Content fade on scroll
      gsap.to(content, {
        y: -30,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Scroll indicator
      tl.from(
        '.hero__scroll-indicator',
        {
          opacity: 0,
          y: -10,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="home" ref={sectionRef}>
      <div className="hero__inner container">
        {/* Left Side: Content aligned directly on the grid */}
        <div className="hero__content" ref={contentRef}>
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            HANDCRAFTED LUXURY CANDLES
          </div>

          <h1 className="hero__title">
            <ScrollFloat
              as="span"
              containerClassName="hero__title-line"
              animationType="out"
              scrollStart="top top"
              scrollEnd="60% top"
              ease="power1.inOut"
              stagger={0.03}
            >
              Truly Unique
            </ScrollFloat>
            <ScrollFloat
              as="span"
              containerClassName="hero__title-line hero__title-accent"
              animationType="out"
              scrollStart="top top"
              scrollEnd="60% top"
              ease="power1.inOut"
              stagger={0.03}
            >
              Home Fragrances
            </ScrollFloat>
          </h1>

          <p className="hero__subtitle">
            Using a blend of coconut and rapeseed wax, free from paraffin, soy, colourants or additional additives.
          </p>

          <div className="hero__actions">
            <MagneticButton
              href="#shop"
              className="hero__btn hero__btn--primary"
              strength={0.3}
            >
              Buy Now
              <span className="hero__btn-arrow">→</span>
            </MagneticButton>
            <MagneticButton
              href="#process"
              className="hero__btn hero__btn--secondary"
              strength={0.3}
            >
              Our Process
            </MagneticButton>
          </div>

          <div className="hero__features">
            <div className="hero__feature">
              <span className="hero__feature-dot"></span>
              Natural Wax
            </div>
            <div className="hero__feature">
              <span className="hero__feature-dot"></span>
              Hand-Poured
            </div>
            <div className="hero__feature">
              <span className="hero__feature-dot"></span>
              Toxin Free
            </div>
            <div className="hero__feature">
              <span className="hero__feature-dot"></span>
              60+ Hour Burn
            </div>
          </div>
        </div>

        {/* Right Side: Clean product image with shadow and glow */}
        <div className="hero__image-wrapper" ref={imageRef}>
          <div className="hero__image-glow" ref={glowRef}></div>
          <img
            src={heroCandle}
            alt="Veloura luxury candle in frosted glass jar"
            className="hero__image"
          />
        </div>
      </div>

      <div className="hero__scroll-indicator">
        <div className="hero__scroll-line"></div>
      </div>
    </section>
  );
};

export default HeroSection;
