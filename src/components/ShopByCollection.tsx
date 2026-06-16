import { useRef, useEffect, useState } from 'react';
import './ShopByCollection.css';

// Import image assets
import logoImg from '../assets/images/logo.png';
import catPremium from '../assets/images/cat-premium.png';
import catDecorative from '../assets/images/cat-decorative.png';
import catDessert from '../assets/images/cat-dessert.png';
import catWaxMelts from '../assets/images/cat-waxmelts.png';
import catColour from '../assets/images/cat-colour.png';
import festivalCandlesImage from '../assets/images/festival-candles.png';
import curing from '../assets/images/curing.png';
import pouring from '../assets/images/pouring.png';

interface CollectionItem {
  id: string;
  name: string;
  label: string;
  image: string;
  color: string;
}

const collections: CollectionItem[] = [
  {
    id: 'All',
    name: 'All Products',
    label: 'All Products',
    image: logoImg,
    color: 'linear-gradient(45deg, #C9A86A, #E8D3A9, #D98E32)',
  },
  {
    id: 'Premium Candles',
    name: 'Premium Candles',
    label: 'Premium Candles',
    image: catPremium,
    color: 'linear-gradient(45deg, #D98E32, #f39c12)',
  },
  {
    id: 'Decorative Candles',
    name: 'Decorative Candles',
    label: 'Decorative Candles',
    image: catDecorative,
    color: 'linear-gradient(45deg, #E8D3A9, #e74c3c)',
  },
  {
    id: 'Dessert Candles',
    name: 'Dessert Candles',
    label: 'Dessert Candles',
    image: catDessert,
    color: 'linear-gradient(45deg, #D98E32, #e67e22)',
  },
  {
    id: 'Combos',
    name: 'Combos',
    label: 'Combos',
    image: catWaxMelts,
    color: 'linear-gradient(45deg, #C9A86A, #2ecc71)',
  },
  {
    id: 'Gift Box',
    name: 'Gift Box',
    label: 'Gift Box',
    image: curing,
    color: 'linear-gradient(45deg, #E8D3A9, #9b59b6)',
  },
  {
    id: 'Customize Candles',
    name: 'Customize Candles',
    label: 'Customize Candles',
    image: pouring,
    color: 'linear-gradient(45deg, #D98E32, #1abc9c)',
  },
  {
    id: 'Festival Candles',
    name: 'Festival Candles',
    label: 'Festival Candles',
    image: festivalCandlesImage,
    color: 'linear-gradient(45deg, #E8D3A9, #3498db)',
  },
];

interface ShopByCollectionProps {
  activeCategoryFilter: string;
  setActiveCategoryFilter: (category: string) => void;
}

const ShopByCollection = ({ activeCategoryFilter, setActiveCategoryFilter }: ShopByCollectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to show/hide arrows
  const checkScrollArrows = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollArrows);
      // Run once on load
      checkScrollArrows();
      window.addEventListener('resize', checkScrollArrows);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollArrows);
      }
      window.removeEventListener('resize', checkScrollArrows);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.6;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleBubbleClick = (categoryId: string) => {
    setActiveCategoryFilter(categoryId);
    // Smooth scroll to the shop section
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="collections-nav">
      <div className="collections-nav__inner container">
        <h2 className="collections-nav__title">-- SHOP BY COLLECTION --</h2>
        
        <div className="collections-nav__slider-wrapper">
          {showLeftArrow && (
            <button 
              className="collections-nav__arrow collections-nav__arrow--left" 
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
            >
              <span>‹</span>
            </button>
          )}

          <div className="collections-nav__scroll-container" ref={scrollContainerRef}>
            <div className="collections-nav__list">
              {collections.map((item) => {
                const isActive = activeCategoryFilter === item.id;
                return (
                  <button
                    key={item.id}
                    className={`collections-nav__item ${isActive ? 'collections-nav__item--active' : ''}`}
                    onClick={() => handleBubbleClick(item.id)}
                  >
                    <div className="collections-nav__bubble-outer" style={{ backgroundImage: item.color }}>
                      <div className="collections-nav__bubble-inner">
                        <img 
                          src={item.image} 
                          alt={item.label} 
                          className="collections-nav__image" 
                        />
                      </div>
                    </div>
                    <span className="collections-nav__label">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {showRightArrow && (
            <button 
              className="collections-nav__arrow collections-nav__arrow--right" 
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
            >
              <span>›</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByCollection;
