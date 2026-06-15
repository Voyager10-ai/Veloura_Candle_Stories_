import { useState } from 'react';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import HeroSection from './components/HeroSection';
import ShopByCollection from './components/ShopByCollection';
import ShopSection from './components/ShopSection';
import type { Product } from './components/ShopSection';
import BenefitsSection from './components/BenefitsSection';
import ActivationsSection from './components/ActivationsSection';
import TrustSection from './components/TrustSection';
import CustomerExperience from './components/CustomerExperience';
import InstagramFeed from './components/InstagramFeed';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CursorEffects from './components/CursorEffects';
import ParticleBackground from './components/ParticleBackground';
import CartDrawer from './components/CartDrawer';
import type { CartItem } from './components/CartDrawer';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Open cart drawer immediately on add to cart for sleek premium shopping confirmation
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <CursorEffects />
      <ParticleBackground />
      <AnnouncementBar />
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={cartCount} onCategoryFilter={setActiveCategoryFilter} />
      <main>
        <HeroSection />
        <ShopByCollection activeCategoryFilter={activeCategoryFilter} setActiveCategoryFilter={setActiveCategoryFilter} />
        <ShopSection onAddToCart={handleAddToCart} activeCategoryFilter={activeCategoryFilter} />
        <BenefitsSection />
        <ActivationsSection />
        <TrustSection />
        <CustomerExperience />
        <InstagramFeed />
        <ContactSection />
      </main>
      <Footer />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </>
  );
}

export default App;

// Trigger redeployment to clear modal changes
