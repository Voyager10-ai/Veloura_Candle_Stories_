import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ConfettiButton from './ConfettiButton';
import catPremium from '../assets/images/cat-premium.png';
import catDecorative from '../assets/images/cat-decorative.png';
import catDessert from '../assets/images/cat-dessert.png';
import catWaxMelts from '../assets/images/cat-waxmelts.png';
import catColour from '../assets/images/cat-colour.png';
import './ProductShowcase.css';

gsap.registerPlugin(ScrollTrigger);

export interface CategoryItem {
  id: number;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  priceText: string;
  image: string;
  color: string;
  tags: string[];
}

export const categories: CategoryItem[] = [
  {
    id: 1,
    name: 'Premium Candles',
    badge: 'Luxury Collection',
    tagline: 'Luxury Iced Latte & Fruit Blends',
    description: 'Exquisite, hand-poured luxury soy candles featuring our signature iced latte series and fresh fruit jelly delights.',
    priceText: 'Starting from ₹499',
    image: catPremium,
    color: '#D98E32', // Amber
    tags: ['Iced Latte Series', 'Fruit Jelly Delights', 'Premium Soy Wax', 'Hand-poured Luxury'],
  },
  {
    id: 3,
    name: 'Decorative Candles',
    badge: 'Artistic Decor',
    tagline: 'Aesthetic Bubble & Geometric Shapes',
    description: 'Charming geometric and bubble candles in pastel tones, crafted to serve as beautiful focal points in your home.',
    priceText: 'Starting from ₹399',
    image: catDecorative,
    color: '#E8D3A9', // Blush / Champagne Gold
    tags: ['Modern Shapes', 'Hand-molded', 'Aesthetic Home', 'Vibrant Vibe'],
  },
  {
    id: 4,
    name: 'Dessert Candles',
    badge: 'Gourmet Treats',
    tagline: 'Strawberry Bowl & Sweet Delights',
    description: 'Ultra-realistic dessert candles crafted with whipped wax cream and delicious fruit wax details. Smells as sweet as it looks!',
    priceText: 'Starting from ₹499',
    image: catDessert,
    color: '#D98E32', // Amber
    tags: ['Whipped Wax', 'Gourmet Aromas', 'Realistic Details', 'Artisanal Design'],
  },
  {
    id: 5,
    name: 'Wax Melts & Sachets',
    badge: 'Home Fragrance',
    tagline: 'Aromatic Waffles & Botanical Sachets',
    description: 'Flameless home fragrance options featuring waffle-shaped wax melts and decorative botanically-infused soy wax sachets.',
    priceText: 'Starting from ₹199',
    image: catWaxMelts,
    color: '#C9A86A', // Gold
    tags: ['Flameless Scent', 'Botanical Sachets', 'High Scent Throw', 'Natural Herbs'],
  },
  {
    id: 6,
    name: 'Colour Candles',
    badge: 'Vibrant Light',
    tagline: 'Rich Pillar & Colorful Accents',
    description: 'Vibrant, hand-poured pillar candles in rich color tones, designed to bring warmth and energy to your space.',
    priceText: 'Starting from ₹249',
    image: catColour,
    color: '#E8D3A9', // Blush
    tags: ['Pillar Candles', 'Rich Crimson Red', 'Vibrant Color', 'Multi-Height Pack'],
  },
];

interface ProductShowcaseProps {
  setActiveCategoryFilter?: (category: string) => void;
}

const ProductShowcase = ({ setActiveCategoryFilter }: ProductShowcaseProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const activeCategory = categories[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const handleExplore = () => {
    if (setActiveCategoryFilter) {
      setActiveCategoryFilter(activeCategory.name);
    }
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // GSAP scroll-triggered entrance
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from('.products__header', {
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

      // Slider container animation
      gsap.from('.products__slider-container', {
        y: 60,
        opacity: 0,
        duration: 1,
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

  // GSAP slide transition when activeIndex changes
  useEffect(() => {
    // Kill any running tweens on these elements immediately to prevent stacking
    if (imageRef.current) {
      gsap.killTweensOf(imageRef.current);
    }
    if (infoRef.current) {
      gsap.killTweensOf(infoRef.current);
    }

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { opacity: 0, x: -30, scale: 0.92, rotate: -3 },
          { opacity: 1, x: 0, scale: 1, rotate: 0, duration: 0.4, ease: 'power3.out', overwrite: true }
        );
      }
      if (infoRef.current) {
        gsap.fromTo(infoRef.current,
          { opacity: 0, x: 25 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out', overwrite: true }
        );
      }
    }, sliderRef);

    return () => ctx.revert();
  }, [activeIndex]);

  // Interactive 3D mouse tilt effect on the slider card
  useEffect(() => {
    const card = sliderRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles (max 6 degrees for subtle luxury feel)
      const rotateX = -(y - centerY) / centerY * 6;
      const rotateY = (x - centerX) / centerX * 6;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="products" id="categories" ref={sectionRef}>
      <div className="products__inner container">
        <div className="products__header">
          <span className="section-label">Explore Collection</span>
          <h2 className="section-title">Our Categories</h2>
          <p className="products__subtitle">
            Discover our diverse range of premium handcrafted candles and home fragrances.
          </p>
        </div>

        <div className="products__slider-container">
          <button 
            className="products__arrow products__arrow--prev" 
            onClick={handlePrev}
            aria-label="Previous category"
          >
            <span>‹</span>
          </button>

          <div className="products__slider-card" ref={sliderRef}>
            <div className="products__slider-inner">
              <div className="products__image-side">
                <div 
                  className="products__image-glow"
                  style={{
                    background: `radial-gradient(circle, ${activeCategory.color}25 0%, transparent 70%)`
                  }}
                ></div>
                <img 
                  ref={imageRef}
                  src={activeCategory.image} 
                  alt={activeCategory.name} 
                  className="products__slider-image"
                />
              </div>

              <div className="products__info-side" ref={infoRef}>
                <span className="products__category" style={{ color: activeCategory.color }}>
                  {activeCategory.badge}
                </span>
                <h3 className="products__name">{activeCategory.name}</h3>
                <p className="products__scent-notes">{activeCategory.tagline}</p>
                <p className="products__desc">{activeCategory.description}</p>
                
                <div className="products__tags">
                  {activeCategory.tags.map((tag, i) => (
                    <span key={i} className="products__tag">{tag}</span>
                  ))}
                </div>

                <div className="products__buy-action">
                  <span className="products__price">{activeCategory.priceText}</span>
                  <ConfettiButton 
                    className="products__add-btn" 
                    id={`explore-category-${activeCategory.id}`}
                    onClick={handleExplore}
                    confettiConfig={{
                      particleCount: 150,
                      spread: 80,
                      colors: [
                        '#C9A86A', // Antique Gold
                        '#E8D3A9', // Champagne Gold
                        '#D98E32', // Soft Amber
                        '#F8F4EE', // Warm Ivory
                        '#ffffff'  // Pure White
                      ]
                    }}
                  >
                    Explore Collection
                  </ConfettiButton>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="products__arrow products__arrow--next" 
            onClick={handleNext}
            aria-label="Next category"
          >
            <span>›</span>
          </button>
        </div>

        <div className="products__dots">
          {categories.map((_, index) => (
            <button
              key={index}
              className={`products__dot ${index === activeIndex ? 'products__dot--active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
