import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import logoImg from '../assets/images/logo.png';
import MagneticButton from './MagneticButton';
import InteractiveHoverButton from './InteractiveHoverButton';
import { shopProducts } from './ShopSection';
import './Navbar.css';

/* ───── Search result types ───── */
interface SearchResult {
  type: 'product' | 'category' | 'page';
  label: string;
  subtitle: string;
  image?: string;
  price?: number;
  categoryId?: string;
  href?: string;
  score: number;
}

/* ───── Static page sections users can navigate to ───── */
const pageSections = [
  { label: 'Home', subtitle: 'Back to the top', href: '#home', keywords: ['home', 'top', 'hero', 'landing'] },
  { label: 'Shop', subtitle: 'Browse all products', href: '#shop', keywords: ['shop', 'products', 'buy', 'store', 'candle', 'candles', 'browse'] },
  { label: 'Our Story', subtitle: 'Activations & process', href: '#stories', keywords: ['story', 'stories', 'about', 'process', 'our story', 'journey'] },
  { label: 'Contact', subtitle: 'Get in touch', href: '#contact', keywords: ['contact', 'help', 'email', 'phone', 'reach', 'support', 'need help'] },
  { label: 'Benefits', subtitle: 'Why choose Veloura', href: '#benefits', keywords: ['benefits', 'why', 'features', 'soy wax', 'natural', 'hand poured'] },
  { label: 'Reviews', subtitle: 'Customer experiences', href: '#reviews', keywords: ['review', 'reviews', 'testimonial', 'experience', 'customer', 'rating'] },
  { label: 'Instagram', subtitle: '@veloura.candles', href: '#instagram', keywords: ['instagram', 'social', 'follow', 'insta', 'feed'] },
];

/* ───── Unique categories from products ───── */
const uniqueCategories = Array.from(new Set(shopProducts.map(p => p.category)));

/* ───── Fuzzy match scoring ───── */
function scoreMatch(haystack: string, needle: string): number {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  
  // Exact match → highest score
  if (h === n) return 100;
  // Starts with → very high
  if (h.startsWith(n)) return 90;
  // Contains as word boundary (e.g. "amber" in "Amber & Oud")
  const wordBoundary = new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
  if (wordBoundary.test(haystack)) return 75;
  // Contains anywhere
  if (h.includes(n)) return 60;
  // Check individual search words
  const words = n.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const matchCount = words.filter(w => h.includes(w)).length;
    if (matchCount === words.length) return 55;
    if (matchCount > 0) return 30 * (matchCount / words.length);
  }
  return 0;
}

function searchProducts(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  // 1. Search products with weighted scoring across fields
  for (const product of shopProducts) {
    let bestScore = 0;
    
    // Name match (highest weight)
    const nameScore = scoreMatch(product.name, q) * 1.0;
    bestScore = Math.max(bestScore, nameScore);

    // Category match
    const catScore = scoreMatch(product.category, q) * 0.85;
    bestScore = Math.max(bestScore, catScore);

    // Scent match
    const scentScore = scoreMatch(product.scent, q) * 0.7;
    bestScore = Math.max(bestScore, scentScore);

    // Tag matches
    for (const tag of product.tags) {
      const tagScore = scoreMatch(tag, q) * 0.65;
      bestScore = Math.max(bestScore, tagScore);
    }

    // Description match (lowest weight)
    const descScore = scoreMatch(product.description, q) * 0.45;
    bestScore = Math.max(bestScore, descScore);

    if (bestScore > 15) {
      results.push({
        type: 'product',
        label: product.name,
        subtitle: `${product.category} · ${product.scent.split('·')[0].trim()}`,
        image: product.image,
        price: product.price,
        categoryId: product.category,
        score: bestScore,
      });
    }
  }

  // 2. Search categories (show as quick filters)
  for (const cat of uniqueCategories) {
    const catScore = scoreMatch(cat, q);
    if (catScore > 20) {
      results.push({
        type: 'category',
        label: cat,
        subtitle: `${shopProducts.filter(p => p.category === cat).length} products`,
        categoryId: cat,
        score: catScore * 0.95, // Slightly below exact product match
      });
    }
  }

  // 3. Search page sections
  for (const section of pageSections) {
    let sectionScore = scoreMatch(section.label, q);
    for (const kw of section.keywords) {
      sectionScore = Math.max(sectionScore, scoreMatch(kw, q) * 0.9);
    }
    if (sectionScore > 20) {
      results.push({
        type: 'page',
        label: section.label,
        subtitle: section.subtitle,
        href: section.href,
        score: sectionScore * 0.8,
      });
    }
  }

  // Sort by score descending, limit to 8 results
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 8);
}

/* ───── Navbar Props ───── */
interface NavbarProps {
  onCartClick: () => void;
  cartCount: number;
  onCategoryFilter?: (category: string) => void;
}

const Navbar = ({ onCartClick, cartCount, onCategoryFilter }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Compute search results live
  const searchResults = useMemo(() => searchProducts(searchQuery), [searchQuery]);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      if (logoRef.current) {
        tl.from(logoRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        });
      }

      if (linksRef.current) {
        tl.from(
          linksRef.current.children,
          {
            y: -15,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.3'
        );
      }

      if (ctaRef.current) {
        tl.from(
          ctaRef.current,
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
          },
          '-=0.2'
        );
      }
    }, navRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
    if (!searchOpen) {
      setSearchQuery('');
      setActiveResultIndex(-1);
    }
  }, [searchOpen]);

  // Reset active index on query change
  useEffect(() => {
    setActiveResultIndex(-1);
  }, [searchQuery]);

  // Handle result selection
  const handleResultClick = useCallback((result: SearchResult) => {
    setSearchOpen(false);
    setSearchQuery('');

    if (result.type === 'product') {
      // Filter to the product's category and scroll to shop
      if (onCategoryFilter && result.categoryId) {
        onCategoryFilter(result.categoryId);
      }
      setTimeout(() => {
        const shopSection = document.getElementById('shop');
        if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (result.type === 'category') {
      // Filter to the category
      if (onCategoryFilter && result.categoryId) {
        onCategoryFilter(result.categoryId);
      }
      setTimeout(() => {
        const shopSection = document.getElementById('shop');
        if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (result.type === 'page' && result.href) {
      const el = document.querySelector(result.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onCategoryFilter]);

  // Keyboard nav for search results
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!searchOpen) return;

      if (e.key === 'Escape') {
        setSearchOpen(false);
        return;
      }

      if (searchResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveResultIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveResultIndex(prev =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
      } else if (e.key === 'Enter' && activeResultIndex >= 0) {
        e.preventDefault();
        handleResultClick(searchResults[activeResultIndex]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [searchOpen, searchResults, activeResultIndex, handleResultClick]);

  // Scroll active result into view
  useEffect(() => {
    if (activeResultIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll('.search-overlay__result');
      items[activeResultIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeResultIndex]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeResultIndex >= 0 && searchResults[activeResultIndex]) {
      handleResultClick(searchResults[activeResultIndex]);
    } else if (searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    } else if (searchQuery.trim()) {
      // No results — just go to shop with "All"
      if (onCategoryFilter) onCategoryFilter('All');
      const shopSection = document.getElementById('shop');
      if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Shop', href: '#shop' },
    { label: 'Stories', href: '#stories' },
    { label: 'Contact', href: '#contact' },
  ];

  // Type icons
  const typeIcon = (type: string) => {
    if (type === 'product') return '🕯️';
    if (type === 'category') return '📂';
    return '📍';
  };

  return (
    <>
      <header
        ref={navRef}
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        id="navbar"
      >
        <div className="navbar__inner container">
          <a href="#home" className="navbar__logo" ref={logoRef}>
            <img src={logoImg} alt="Veloura Logo" className="navbar__logo-img" />
          </a>

          <nav
            ref={linksRef}
            className={`navbar__nav ${mobileOpen ? 'navbar__nav--open' : ''}`}
          >
            {navLinks.map((link) => (
              <MagneticButton
                key={link.label}
                href={link.href}
                className="navbar__link-wrap"
                strength={0.25}
              >
                <span className="navbar__link" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </span>
              </MagneticButton>
            ))}
            <InteractiveHoverButton
              href="#shop"
              className="navbar__cta navbar__cta--mobile"
              text="Shop Now"
            />

            {/* Sign In link in mobile menu */}
            <a href="#" className="navbar__signin navbar__signin--mobile" onClick={() => setMobileOpen(false)}>
              <svg className="navbar__signin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Sign In</span>
            </a>
          </nav>

          <div ref={ctaRef} className="navbar__right-actions">
            {/* Search Button */}
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              id="search-toggle"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="navbar__icon-svg">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {/* Sign In Button */}
            <a href="#" className="navbar__signin navbar__signin--desktop">
              <svg className="navbar__signin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span className="navbar__signin-text">Sign In</span>
            </a>

            {/* Cart Button */}
            <button className="navbar__cart-btn navbar__cart-btn--desktop" onClick={onCartClick} aria-label="Open cart">
              <span className="navbar__cart-icon">🛒</span>
              {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
            </button>
            
            <InteractiveHoverButton
              href="#shop"
              className="navbar__cta navbar__cta--desktop"
              text="Shop Now"
            />
          </div>

          <div className="navbar__mobile-triggers">
            {/* Mobile Search */}
            <button
              className="navbar__icon-btn navbar__icon-btn--mobile"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="navbar__icon-svg">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            <button className="navbar__cart-btn navbar__cart-btn--mobile" onClick={onCartClick} aria-label="Open cart">
              <span className="navbar__cart-icon">🛒</span>
              {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
            </button>
            
            <button
              className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <div className={`search-overlay ${searchOpen ? 'search-overlay--open' : ''}`}>
        <div className="search-overlay__backdrop" onClick={() => setSearchOpen(false)} />
        <div className="search-overlay__content">
          <button className="search-overlay__close" onClick={() => setSearchOpen(false)} aria-label="Close search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <form className="search-overlay__form" onSubmit={handleSearchSubmit}>
            <svg className="search-overlay__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="search-overlay__input"
              placeholder="Search candles, collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </form>

          {/* Live Results */}
          {searchQuery.trim() && (
            <div className="search-overlay__results" ref={resultsRef}>
              {searchResults.length > 0 ? (
                searchResults.map((result, i) => (
                  <button
                    key={`${result.type}-${result.label}-${i}`}
                    className={`search-overlay__result ${activeResultIndex === i ? 'search-overlay__result--active' : ''}`}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setActiveResultIndex(i)}
                  >
                    {result.image ? (
                      <img src={result.image} alt="" className="search-overlay__result-img" />
                    ) : (
                      <span className="search-overlay__result-emoji">{typeIcon(result.type)}</span>
                    )}
                    <div className="search-overlay__result-info">
                      <span className="search-overlay__result-label">{result.label}</span>
                      <span className="search-overlay__result-sub">{result.subtitle}</span>
                    </div>
                    <div className="search-overlay__result-meta">
                      {result.price && (
                        <span className="search-overlay__result-price">₹{result.price.toLocaleString('en-IN')}</span>
                      )}
                      <span className={`search-overlay__result-type search-overlay__result-type--${result.type}`}>
                        {result.type}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="search-overlay__no-results">
                  <span className="search-overlay__no-emoji">🔍</span>
                  <p>No results found for "<strong>{searchQuery}</strong>"</p>
                  <p className="search-overlay__no-sub">Try searching for candle names, categories, or scents</p>
                </div>
              )}
            </div>
          )}

          <p className="search-overlay__hint">
            {searchResults.length > 0 ? (
              <>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Enter</kbd> to select · <kbd>Esc</kbd> to close</>
            ) : (
              <>Press <kbd>Esc</kbd> to close</>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;

