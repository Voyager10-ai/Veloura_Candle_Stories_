import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ConfettiButton from './ConfettiButton';

// Import all product and category image assets
import candleAmber from '../assets/images/candle-amber.png';
import candleJasmine from '../assets/images/candle-jasmine.png';
import candleCedar from '../assets/images/candle-cedar.png';
import lavender from '../assets/images/lavender.png';
import lemongrass from '../assets/images/lemongrass.png';
import catDecorative from '../assets/images/cat-decorative.png';
import catDessert from '../assets/images/cat-dessert.png';
import catColour from '../assets/images/cat-colour.png';
import catWaxMelts from '../assets/images/cat-waxmelts.png';
import blending from '../assets/images/blending.png';
import pouring from '../assets/images/pouring.png';
import sourcing from '../assets/images/sourcing.png';
import heroCandle from '../assets/images/hero-candle.png';
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
    price: 499,
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
    price: 499,
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
    price: 499,
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
    price: 499,
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
    description: 'Perfect for festivals, aromatic , peaceful',
    price: 299,
    image: teaLights,
    color: '#E8D3A9',
    tags: ['Festive Decor', 'Aromatic Scent', 'Peaceful Burn'],
  },
  {
    id: 305,
    name: 'Scented jar candles',
    category: 'Decorative Candles',
    scent: 'Lavender · Sandalwood · Jasmine',
    description: 'Fragrance candles with aromatic scents',
    price: 499,
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
    price: 299,
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
    price: 399,
    image: bubbleCandle,
    color: '#E8D3A9',
    tags: ['Aesthetic Home', 'Gifting Idea', 'Bubble Mold'],
  },

  // Category 4: Dessert Candles
  {
    id: 4,
    name: 'Jasmine Dream',
    category: 'Dessert Candles',
    scent: 'Night Jasmine · Tuberose · Musk',
    description: 'An alluring floral scent that transports you to a blooming midnight garden.',
    price: 1199,
    image: candleJasmine,
    color: '#B5C2B7',
    tags: ['Delicate Scent', 'Soothing', 'Midnight Bloom'],
  },
  {
    id: 402,
    name: 'Strawberry Cream Bowl',
    category: 'Dessert Candles',
    scent: 'Fresh Strawberry · Sweet Vanilla Cream',
    description: 'A realistic glass bowl candle topped with whipped soy cream and strawberry wax embeds.',
    price: 599,
    image: catDessert,
    color: '#D98E32',
    tags: ['Whipped Cream Wax', 'Strawberry Scent', 'Gourmet'],
  },
  {
    id: 403,
    name: 'Chocolate Fudge Sundae',
    category: 'Dessert Candles',
    scent: 'Dark Chocolate · Fudge · Caramel',
    description: 'A decadent treat candle featuring layers of fudge wax, whipped cream, and a wax cherry.',
    price: 549,
    image: blending,
    color: '#D98E32',
    tags: ['Decadent Cocoa', 'Sundae Mold', 'Sweet Delights'],
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
    name: 'Golden Opulence Gift Box',
    category: 'Gift Box',
    scent: 'Sandalwood · Vanilla · Saffron',
    description: 'Our flagship gold-foiled gift box containing a signature candle, brass snuffer, and a jar of safety matches.',
    price: 1899,
    image: sourcing,
    color: '#E8D3A9',
    tags: ['Luxury Gift', 'Corporate Gift', 'Custom Card'],
  },
  {
    id: 602,
    name: 'Calm & Ground Self-Care Box',
    category: 'Gift Box',
    scent: 'Sage · Lavender · Lemongrass',
    description: 'A soothing gift set containing Sage & Sea votives, lemongrass melts, and an organic cotton ritual towel.',
    price: 999,
    image: lemongrass,
    color: '#E8D3A9',
    tags: ['Wellness Gift', 'Self-Care', 'Organic Cotton'],
  },
  {
    id: 603,
    name: 'Sculptural Art Gift Set',
    category: 'Gift Box',
    scent: 'Cotton Candy · Sandalwood · Musk',
    description: 'A luxury gift box featuring our pastel bubble cube and marble-finish Venus bust candles.',
    price: 1199,
    image: catDecorative,
    color: '#E8D3A9',
    tags: ['Home Decor', 'Curated Set', 'Aesthetic Shapes'],
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

  // Category 8: Colour Candles
  {
    id: 801,
    name: 'Cedarwood Forest',
    category: 'Colour Candles',
    scent: 'Cedar · Cypress · Pine Needle',
    description: 'Woodland moss and towering evergreens capture the stillness of mountain air.',
    price: 1199,
    image: candleCedar,
    color: '#8D9B82',
    tags: ['Woodland', 'Deep Peace', 'Cleansing'],
  },
  {
    id: 802,
    name: 'Crimson Red Pillar Set',
    category: 'Colour Candles',
    scent: 'Spiced Apple · Cinnamon',
    description: 'A beautiful set of multi-height solid red pillar candles with a warm spicy fragrance.',
    price: 599,
    image: catColour,
    color: '#E8D3A9',
    tags: ['Solid Color Pillar', 'Spiced Apple', 'Holiday Vibe'],
  },
  {
    id: 803,
    name: 'Ocean Blue Tealights Pack',
    category: 'Colour Candles',
    scent: 'Sea Breeze · Jasmine',
    description: 'A pack of 6 color-accented soy tealights for floating displays and candle holders.',
    price: 249,
    image: heroCandle,
    color: '#E8D3A9',
    tags: ['Tealight Pack', 'Sea Breeze Scent', '6-Piece Set'],
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
