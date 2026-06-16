import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ConfettiButton from './ConfettiButton';

// Import all product and category image assets
import candleAmber from '../assets/images/candle-amber.png';

import lavender from '../assets/images/lavender.png';


import catWaxMelts from '../assets/images/cat-waxmelts.png';
import pouring from '../assets/images/pouring.png';


import logo from '../assets/images/logo.png';

// New premium candle assets
import icedLatte from '../assets/images/iced-latte.png';
import icedStrawberryLatte from '../assets/images/iced-strawberry-latte.png';
import icedMatchaLatte from '../assets/images/iced-matcha-latte.png';
import icedLavenderLatte from '../assets/images/iced-lavender-latte.png';
import raspberryFruit from '../assets/images/raspberry-fruit.jpg';
import orangeFruit from '../assets/images/orange-fruit.jpg';
import blueberryFruit from '../assets/images/blueberry-fruit.jpg';
import strawberryFruitPremium from '../assets/images/strawberry-fruit-premium.png';

// New decorative candle assets
import teaLights from '../assets/images/tea-lights.jpg';
import scentedJars from '../assets/images/scented-jars.png';
import smallBubble from '../assets/images/small-bubble.jpg';
import bubbleCandle from '../assets/images/bubble-candle.jpg';

// New dessert candle assets
import dessertCandle from '../assets/images/dessert-candle.png';
import chaiCandle from '../assets/images/chai-candle.jpg';

// New festival candle assets
import festivalMithai from '../assets/images/festival-mithai.jpg';
import lotusUrli from '../assets/images/lotus-urli.jpg';
import modakCandle from '../assets/images/modak-candle.jpg';
import diyaCandle from '../assets/images/diya-candle.jpg';

// Gift hamper asset
import giftHamper from '../assets/images/gift-hamper.jpg';

// New flower candle assets
import daisyBouquets from '../assets/images/daisy-bouquets.jpg';
import roseFlower from '../assets/images/rose-flower.jpg';
import daisyFlower from '../assets/images/daisy-flower.jpg';
import sunflowerCandle from '../assets/images/sunflower-candle.jpg';
import peonyCandle from '../assets/images/peony-candle.jpg';
import tulipCandle from '../assets/images/tulip-candle.jpg';

import './ShopSection.css';

gsap.registerPlugin(ScrollTrigger);

export interface Product {
  id: number;
  name: string;
  category: string;
  scent: string;
  description: string;
  price: number;
  image: string;
  color: string;
  tags: string[];
}

export const shopProducts: Product[] = [
  // Category 1: Premium Candles
  {
    id: 1,
    name: 'Iced Latte Candle',
    category: 'Premium Candles',
    scent: 'Rich Espresso · Warm Milk · Vanilla Foam',
    description: 'A perfect blend of elegance, warmth, and rich coffee fragrance.',
    price: 499,
    image: icedLatte,
    color: '#8B5A2B',
    tags: ['35hr Burn', 'Premium Soy', 'Rich Coffee'],
  },
  {
    id: 102,
    name: 'Iced Strawberry Latte Candle',
    category: 'Premium Candles',
    scent: 'Sweet Strawberry · Creamy Milk · Vanilla',
    description: 'A candle as sweet as your favorite strawberry latte.',
    price: 499,
    image: icedStrawberryLatte,
    color: '#D11E58',
    tags: ['Sweet Cream', 'Handpoured', 'Strawberry Scent'],
  },
  {
    id: 103,
    name: 'Iced Matcha Latte Candle',
    category: 'Premium Candles',
    scent: 'Refreshing Matcha · Steamed Milk · Sweet Soy',
    description: 'Inspired by Matcha. Handcrafted for Serenity.',
    price: 499,
    image: icedMatchaLatte,
    color: '#5F8575',
    tags: ['Matcha Aroma', 'Serenity', 'Handcrafted'],
  },
  {
    id: 104,
    name: 'Iced Lavender Latte Candle',
    category: 'Premium Candles',
    scent: 'French Lavender · Smooth Espresso · Cream',
    description: 'Inspired by Lavender. Crafted for Tranquility.',
    price: 499,
    image: icedLavenderLatte,
    color: '#8A73B3',
    tags: ['Lavender Scent', 'Tranquility', 'Clean Burn'],
  },
  {
    id: 105,
    name: 'Raspberry Fruit Candle',
    category: 'Premium Candles',
    scent: 'Fresh Raspberry · Tart Berries · Vanilla Cream',
    description: 'A Story of Sweetness in Every Glow.',
    price: 399,
    image: raspberryFruit,
    color: '#D10056',
    tags: ['Raspberry Essence', '25hr Burn', 'Sweet Delights'],
  },
  {
    id: 106,
    name: 'Orange Fruit Candle',
    category: 'Premium Candles',
    scent: 'Sweet Orange · Citrus Zest · Vanilla Cream',
    description: 'A Burst of Freshness in Every Flame',
    price: 399,
    image: orangeFruit,
    color: '#E67E22',
    tags: ['Orange Essence', '25hr Burn', 'Zesty Vibe'],
  },
  {
    id: 107,
    name: 'Blueberry Fruit Candle',
    category: 'Premium Candles',
    scent: 'Fresh Blueberry · Wild Berries · Vanilla Cream',
    description: 'A Berry Calm in Every Glow.',
    price: 399,
    image: blueberryFruit,
    color: '#1F4068',
    tags: ['Blueberry Essence', '25hr Burn', 'Calming Vibe'],
  },
  {
    id: 108,
    name: 'Strawberry Fruit Candle',
    category: 'Premium Candles',
    scent: 'Juicy Strawberry · Sweet Cream · Vanilla',
    description: 'A Strawberry Dream in Every Flame.',
    price: 399,
    image: strawberryFruitPremium,
    color: '#D11E58',
    tags: ['Strawberry Essence', '25hr Burn', 'Sweet Delight'],
  },

  // Category 3: Decorative Candles
  {
    id: 304,
    name: 'Tea light candles',
    category: 'Decorative Candles',
    scent: 'Lavender · Lemongrass · Mint',
    description: 'One set contains 12 pieces. Perfect for festivals, aromatic, peaceful.',
    price: 99,
    image: teaLights,
    color: '#E8D3A9',
    tags: ['Festive Decor', 'Aromatic Scent', '12-Piece Set'],
  },
  {
    id: 305,
    name: 'Scented jar candles',
    category: 'Decorative Candles',
    scent: 'Lavender · Sandalwood · Jasmine',
    description: 'Fragrance candles with aromatic scents',
    price: 149,
    image: scentedJars,
    color: '#E8D3A9',
    tags: ['Scented Jars', 'Relaxing Aroma', 'Handpoured'],
  },
  {
    id: 306,
    name: 'Small bubble candle',
    category: 'Decorative Candles',
    scent: 'Sweet Vanilla · Cotton Candy',
    description: 'A charming mini bubble candle, best for home decor and gifting.',
    price: 199,
    image: smallBubble,
    color: '#E8D3A9',
    tags: ['Mini Bubble', 'Heart Accent', 'Aesthetic Gift'],
  },
  {
    id: 307,
    name: 'Bubble candle',
    category: 'Decorative Candles',
    scent: 'Lavender · Vanilla · Musk',
    description: 'Best for home decor, gifting',
    price: 449,
    image: bubbleCandle,
    color: '#E8D3A9',
    tags: ['Aesthetic Home', 'Gifting Idea', 'Bubble Mold'],
  },
  {
    id: 308,
    name: 'Daisy Bouquets',
    category: 'Decorative Candles',
    scent: 'Fresh Daisies · Green Leaves · Soft Musk',
    description: 'Specially for return gifts',
    price: 349,
    image: daisyBouquets,
    color: '#E8D3A9',
    tags: ['Daisy Bouquet', 'Return Gifts', 'Handcrafted Wax'],
  },
  {
    id: 309,
    name: 'Rose Flower Candle',
    category: 'Decorative Candles',
    scent: 'Red Roses · Velvet Petals · Amber',
    description: 'Aromatic, calm, breathtaking',
    price: 199,
    image: roseFlower,
    color: '#E8D3A9',
    tags: ['Rose Scent', 'Petals Mold', 'Calming Glow'],
  },
  {
    id: 310,
    name: 'Daisy Flower Candle',
    category: 'Decorative Candles',
    scent: 'Daisy Blooms · Sweet Nectar',
    description: 'Handcrafted Blooms. Made to Melt Hearts.',
    price: 99,
    image: daisyFlower,
    color: '#E8D3A9',
    tags: ['Handcrafted Blooms', 'Daisy Mold', 'Mini Gift'],
  },
  {
    id: 311,
    name: 'Sunflower Candle',
    category: 'Decorative Candles',
    scent: 'Sunflower Nectar · Warm Honey',
    description: 'Every Bloom Tells a Story.',
    price: 99,
    image: sunflowerCandle,
    color: '#E8D3A9',
    tags: ['Sunflower Mold', 'Bright Vibe', 'Handpoured'],
  },
  {
    id: 312,
    name: 'Peony Candle',
    category: 'Decorative Candles',
    scent: 'Blooming Peony · Rose Water',
    description: 'Petals Poured in Wax',
    price: 249,
    image: peonyCandle,
    color: '#E8D3A9',
    tags: ['Peony Petals', 'Floral Scent', 'Aesthetic Home'],
  },
  {
    id: 313,
    name: 'Tulip Flower Candle',
    category: 'Decorative Candles',
    scent: 'Fresh Tulips · Spring Dew',
    description: 'Blooming Beauty, Beautifully Lit.',
    price: 199,
    image: tulipCandle,
    color: '#E8D3A9',
    tags: ['Tulip Mold', 'Spring Blossom', 'Handpoured'],
  },

  // Category 4: Dessert Candles
  {
    id: 4,
    name: 'Dessert Candle',
    category: 'Dessert Candles',
    scent: 'Vanilla Whip · Sweet Strawberry · Cream',
    description: 'A dessert which you can\'t eat but feel the fragrance',
    price: 499,
    image: dessertCandle,
    color: '#E8D3A9',
    tags: ['Sweet Cream', 'Strawberry Embed', 'Aromatic Dessert'],
  },
  {
    id: 402,
    name: 'Chai Candle',
    category: 'Dessert Candles',
    scent: 'Cardamom · Ginger · Cinnamon · Black Tea',
    description: 'The Comfort of Chai, Captured in Wax.',
    price: 149,
    image: chaiCandle,
    color: '#C9A86A',
    tags: ['Chai Scent', 'Comforting Warmth', 'Biscuit Embed'],
  },

  // Category 5: Combos
  {
    id: 501,
    name: 'Veloura Signature Duo',
    category: 'Combos',
    scent: 'Sandalwood & French Lavender',
    description: 'A curated pairing of our signature soy jar candle and a matching set of botanical wax melts.',
    price: 1499,
    image: catWaxMelts,
    color: '#C9A86A',
    tags: ['Duo Set', 'Gift-Ready', 'Best Value'],
  },

  {
    id: 503,
    name: 'Floral Scent & Sachet Pack',
    category: 'Combos',
    scent: 'Peony, Amber & French Lavender',
    description: 'A comforting floral gift pack containing a Rose & Blush candle and a Lavender botanical sachet.',
    price: 899,
    image: lavender,
    color: '#C9A86A',
    tags: ['Mini Packs', 'Sweet Aromas', 'Botanical Decor'],
  },

  // Category 6: Gift Box
  {
    id: 601,
    name: "Veloura's Special Gift Hamper",
    category: 'Gift Box',
    scent: 'Raspberry · Floral · Wax Sachet',
    description: 'A Box Full of Fragrance, Flowers & Love.',
    price: 1499,
    image: giftHamper,
    color: '#F5C6C6',
    tags: ['Gift Hamper', 'Premium Box', 'Flowers & Love'],
  },

  // Category 7: Customize Candles
  {
    id: 701,
    name: 'Custom Scent Builder',
    category: 'Customize Candles',
    scent: 'Tailored Scent Profile',
    description: 'Design your own signature candle! Select your wax color, choice of fragrance oils, and upload a custom label message.',
    price: 1599,
    image: pouring,
    color: '#D98E32',
    tags: ['Custom Blend', 'Personalized Label', 'Your Design'],
  },
  {
    id: 702,
    name: 'Monogram Classic Jar',
    category: 'Customize Candles',
    scent: 'Classic Sandalwood · Amber',
    description: 'Our classic amber jar candle personalized with a high-shine gold-foil monogram letter of your choice.',
    price: 1399,
    image: candleAmber,
    color: '#D98E32',
    tags: ['Monogram', 'Gift-Ready', 'Gold Foil Label'],
  },
  {
    id: 703,
    name: 'Bespoke Corporate Set',
    category: 'Customize Candles',
    scent: 'Veloura Custom Corporate Blend',
    description: 'Custom branded candles with your corporate logo and tailored scents. Perfect for client gifting and event favors.',
    price: 899,
    image: logo,
    color: '#D98E32',
    tags: ['Bulk Order', 'Logo Print', 'Wedding Favours'],
  },

  // Category 8: Festival Candles
  {
    id: 801,
    name: 'Festival Mithai Candles',
    category: 'Festival Candles',
    scent: 'Traditional · Sweet · Festive',
    description: 'Handcrafted Happiness, One Glow at a Time.',
    price: 199,
    image: festivalMithai,
    color: '#F5A623',
    tags: ['Mithai', 'Handcrafted', 'Festival Special'],
  },
  {
    id: 802,
    name: 'Lotus Serenity Urli Candle',
    category: 'Festival Candles',
    scent: 'Lotus · Serene · Floral',
    description: 'A Timeless Glow for Meaningful Moments.',
    price: 329,
    image: lotusUrli,
    color: '#C5D8B4',
    tags: ['Lotus', 'Urli', 'Meaningful Moments'],
  },
  {
    id: 803,
    name: 'Modak Candle (Pack of 4)',
    category: 'Festival Candles',
    scent: 'Sweet · Traditional · Festive',
    description: 'Modak candle specially for ganpati festival.',
    price: 249,
    image: modakCandle,
    color: '#F8E0B0',
    tags: ['Modak', 'Ganpati', 'Pack of 4'],
  },
  {
    id: 804,
    name: 'Diya Candles',
    category: 'Festival Candles',
    scent: 'Warm · Traditional · Festive',
    description: 'Specially for Diwali.',
    price: 149,
    image: diyaCandle,
    color: '#E8C8A0',
    tags: ['Diya', 'Diwali', 'Traditional'],
  },
];

interface ShopSectionProps {
  onAddToCart: (product: Product) => void;
  activeCategoryFilter: string;
}

const ShopSection = ({ onAddToCart, activeCategoryFilter }: ShopSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.shop__header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Product cards staggering in
      gsap.from('.shop__card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.shop__grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Card mouse move tilt logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardElement: HTMLDivElement) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = -(y - centerY) / centerY * 5;
    const rotateY = (x - centerX) / centerX * 5;

    gsap.to(cardElement, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 800,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = (cardElement: HTMLDivElement) => {
    gsap.to(cardElement, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  };

  const filteredProducts = activeCategoryFilter === 'All'
    ? shopProducts
    : shopProducts.filter(p => p.category === activeCategoryFilter);

  return (
    <section className="shop" id="shop" ref={sectionRef}>
      <div className="shop__inner container">
        <div className="shop__header">
          <span className="section-label">Luxury Collection</span>
          <h2 className="section-title">Explore Our Candles</h2>
          <p className="shop__subtitle">
            Curate your space with our full sensory suite. Handcrafted with sustainably sourced ingredients and signature scents.
          </p>
        </div>

        <div className="shop__grid">
          {filteredProducts.map((product) => {
            let cardRef: HTMLDivElement | null = null;
            return (
              <div 
                key={product.id} 
                className="shop__card"
                ref={(el) => { cardRef = el; }}
                onMouseMove={(e) => cardRef && handleMouseMove(e, cardRef)}
                onMouseLeave={() => cardRef && handleMouseLeave(cardRef)}
              >
                <div className="shop__card-glass">
                  <div className="shop__image-wrapper">
                    <div 
                      className="shop__image-glow"
                      style={{
                        background: `radial-gradient(circle, ${product.color}15 0%, transparent 70%)`
                      }}
                    />
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="shop__image" 
                    />
                    <div className="shop__category-tag" style={{ borderLeft: `2px solid ${product.color}` }}>
                      {product.category}
                    </div>
                  </div>

                  <div className="shop__content">
                    <h3 className="shop__name">{product.name}</h3>
                    <p className="shop__notes">{product.scent}</p>
                    <p className="shop__description">{product.description}</p>
                    
                    <div className="shop__tags">
                      {product.tags.map((tag, i) => (
                        <span key={i} className="shop__tag">{tag}</span>
                      ))}
                    </div>

                    <div className="shop__action">
                      <span className="shop__price">₹{product.price.toLocaleString('en-IN')}</span>
                      <ConfettiButton 
                        className="shop__add-btn"
                        id={`shop-add-btn-${product.id}`}
                        onClick={() => onAddToCart(product)}
                        confettiConfig={{
                          particleCount: 120,
                          spread: 60,
                          colors: [product.color, '#C9A86A', '#E8D3A9', '#ffffff']
                        }}
                      >
                        Add to Cart
                      </ConfettiButton>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
