import { useEffect, useRef, useState } from 'react';
import type { Product } from './ShopSection';
import './CartDrawer.css';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

type CheckoutStep = 'cart' | 'shipping' | 'method';

const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('cart'); // Reset to first step when drawer opens
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close drawer on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const shippingThreshold = 2000;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150;
  const total = subtotal + shippingCost;

  const triggerConfetti = () => {
    const confetti = (window as any).confetti;
    if (confetti) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#C9A86A', '#E8D3A9', '#D98E32', '#ffffff']
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingInfo.name.trim()) newErrors.name = 'Name is required';
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(shippingInfo.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(shippingInfo.pincode.trim())) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const proceedToMethodSelection = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('method');
    }
  };

  const formatOrderMessage = () => {
    const itemsList = cartItems
      .map((item) => `• ${item.product.name} (x${item.quantity}) - ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');
      
    return `✨ *New Order from Veloura Website* ✨\n\n` +
           `*Customer Details:*\n` +
           `• *Name:* ${shippingInfo.name}\n` +
           `• *Email:* ${shippingInfo.email}\n` +
           `• *Phone:* ${shippingInfo.phone}\n` +
           `• *Address:* ${shippingInfo.address}, ${shippingInfo.city} - ${shippingInfo.pincode}\n\n` +
           `*Order Items:*\n${itemsList}\n\n` +
           `*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n` +
           `*Shipping:* ${shippingCost === 0 ? 'Free' : `₹${shippingCost}`}\n` +
           `*Total Amount:* ₹${total.toLocaleString('en-IN')}\n\n` +
           `Looking forward to receiving confirmation!`;
  };

  const handleWhatsAppCheckout = () => {
    const message = formatOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919607643703?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    triggerConfetti();
    onClearCart();
    onClose();
    setStep('cart');
  };

  const handleInstagramCheckout = () => {
    const message = formatOrderMessage();
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });

    const instagramUrl = 'https://www.instagram.com/veloura__candle_stories?igsh=MWtxbngzemdqZnlnMA==';
    window.open(instagramUrl, '_blank');
    
    triggerConfetti();
    onClearCart();
    onClose();
    setStep('cart');
  };

  const handleDirectCheckout = async () => {
    setIsSubmitting(true);
    const orderNum = 'VD-' + Math.floor(100000 + Math.random() * 900000);
    
    const orderData = {
      orderNumber: orderNum,
      customer: shippingInfo,
      items: cartItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      shippingCost,
      total,
    };

    try {
      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit order');
      }

      triggerConfetti();
      onClearCart();
      onClose();
      setStep('cart');
      alert(`Thank you! Your Cash on Delivery order has been submitted successfully.\nAn email confirmation has been sent to ${shippingInfo.email}.\nOrder Number: ${orderNum}`);
    } catch (err: any) {
      console.error('Order submission failed:', err);
      alert(`There was a problem submitting your order: ${err.message || 'Please try again later or contact us on WhatsApp.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`cart-drawer-overlay ${isOpen ? 'cart-drawer-overlay--open' : ''}`} onClick={onClose}>
      <div 
        className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        ref={drawerRef}
      >
        {/* Header */}
        <div className="cart-drawer__header">
          {step === 'shipping' && (
            <button className="cart-drawer__back-btn" onClick={() => setStep('cart')}>
              ← Back
            </button>
          )}
          {step === 'method' && (
            <button className="cart-drawer__back-btn" onClick={() => setStep('shipping')}>
              ← Back
            </button>
          )}
          <h2 className="cart-drawer__title">
            {step === 'cart' && 'Your Cart'}
            {step === 'shipping' && 'Delivery Info'}
            {step === 'method' && 'Order Checkout'}
          </h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="cart-drawer__empty">
            <span className="cart-drawer__empty-icon">🕯️</span>
            <p className="cart-drawer__empty-text">Your cart is empty.</p>
            <button className="cart-drawer__empty-btn" onClick={onClose}>
              Shop Our Scents
            </button>
          </div>
        ) : (
          /* Cart flow steps */
          <>
            {step === 'cart' && (
              <>
                <div className="cart-drawer__items">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="cart-drawer__item">
                      <div className="cart-drawer__item-img-wrapper" style={{ borderLeft: `2px solid ${item.product.color}` }}>
                        <img src={item.product.image} alt={item.product.name} className="cart-drawer__item-img" />
                      </div>
                      
                      <div className="cart-drawer__item-info">
                        <div className="cart-drawer__item-top">
                          <h4 className="cart-drawer__item-name">{item.product.name}</h4>
                          <button 
                            className="cart-drawer__item-remove" 
                            onClick={() => onRemoveItem(item.product.id)}
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="cart-drawer__item-category">{item.product.category}</p>
                        
                        <div className="cart-drawer__item-bottom">
                          <div className="cart-drawer__quantity-selector">
                            <button 
                              className="cart-drawer__qty-btn"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="cart-drawer__qty-val">{item.quantity}</span>
                            <button 
                              className="cart-drawer__qty-btn"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="cart-drawer__item-price">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Summary */}
                <div className="cart-drawer__footer">
                  <div className="cart-drawer__summary-row">
                    <span className="cart-drawer__summary-label">Subtotal</span>
                    <span className="cart-drawer__summary-val">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="cart-drawer__summary-row">
                    <span className="cart-drawer__summary-label">
                      Shipping
                      {subtotal < shippingThreshold && (
                        <span className="cart-drawer__shipping-note">
                          (Free above ₹{shippingThreshold.toLocaleString('en-IN')})
                        </span>
                      )}
                    </span>
                    <span className="cart-drawer__summary-val">
                      {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                    </span>
                  </div>

                  {subtotal < shippingThreshold && (
                    <div className="cart-drawer__shipping-progress-wrapper">
                      <div className="cart-drawer__shipping-progress-text">
                        Add <strong>₹{(shippingThreshold - subtotal).toLocaleString('en-IN')}</strong> more for Free Shipping
                      </div>
                      <div className="cart-drawer__shipping-bar">
                        <div 
                          className="cart-drawer__shipping-bar-fill" 
                          style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="cart-drawer__summary-row cart-drawer__summary-row--total">
                    <span className="cart-drawer__summary-label">Total</span>
                    <span className="cart-drawer__summary-val">₹{total.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    className="cart-drawer__checkout-btn"
                    onClick={() => setStep('shipping')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}

            {step === 'shipping' && (
              <form onSubmit={proceedToMethodSelection} className="cart-drawer__form">
                <div className="cart-drawer__form-scroll">
                  <p className="cart-drawer__form-desc">Please provide your delivery information to complete the order.</p>
                  
                  <div className="cart-drawer__field">
                    <label htmlFor="shipping-name">Full Name</label>
                    <input
                      type="text"
                      id="shipping-name"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                    />
                    {errors.name && <span className="cart-drawer__error">{errors.name}</span>}
                  </div>

                  <div className="cart-drawer__field">
                    <label htmlFor="shipping-email">Email Address</label>
                    <input
                      type="email"
                      id="shipping-email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@gmail.com"
                    />
                    {errors.email && <span className="cart-drawer__error">{errors.email}</span>}
                  </div>

                  <div className="cart-drawer__field">
                    <label htmlFor="shipping-phone">Phone Number</label>
                    <input
                      type="tel"
                      id="shipping-phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <span className="cart-drawer__error">{errors.phone}</span>}
                  </div>

                  <div className="cart-drawer__field">
                    <label htmlFor="shipping-address">Delivery Address</label>
                    <input
                      type="text"
                      id="shipping-address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Apartment, Street address, Landmark"
                    />
                    {errors.address && <span className="cart-drawer__error">{errors.address}</span>}
                  </div>

                  <div className="cart-drawer__form-row">
                    <div className="cart-drawer__field">
                      <label htmlFor="shipping-city">City</label>
                      <input
                        type="text"
                        id="shipping-city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai"
                      />
                      {errors.city && <span className="cart-drawer__error">{errors.city}</span>}
                    </div>

                    <div className="cart-drawer__field">
                      <label htmlFor="shipping-pincode">Pincode</label>
                      <input
                        type="text"
                        id="shipping-pincode"
                        name="pincode"
                        value={shippingInfo.pincode}
                        onChange={handleInputChange}
                        placeholder="e.g. 400001"
                      />
                      {errors.pincode && <span className="cart-drawer__error">{errors.pincode}</span>}
                    </div>
                  </div>
                </div>

                <div className="cart-drawer__footer">
                  <button type="submit" className="cart-drawer__checkout-btn">
                    Select Order Method
                  </button>
                </div>
              </form>
            )}

            {step === 'method' && (
              <div className="cart-drawer__methods">
                <div className="cart-drawer__methods-scroll">
                  <p className="cart-drawer__methods-desc">Choose how you'd like to confirm and pay for your order:</p>
                  
                  {copied && (
                    <div className="cart-drawer__toast">
                      Order details copied to clipboard!
                    </div>
                  )}

                  <button 
                    type="button"
                    onClick={handleWhatsAppCheckout} 
                    className="cart-drawer__method-btn cart-drawer__method-btn--whatsapp"
                  >
                    <span className="cart-drawer__method-icon">💬</span>
                    <div className="cart-drawer__method-text">
                      <strong>Confirm on WhatsApp</strong>
                      <span>Send formatted order direct to chat</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={handleInstagramCheckout} 
                    className="cart-drawer__method-btn cart-drawer__method-btn--instagram"
                  >
                    <span className="cart-drawer__method-icon">📸</span>
                    <div className="cart-drawer__method-text">
                      <strong>Order via Instagram DM</strong>
                      <span>Copies order to clipboard & opens DMs</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={handleDirectCheckout} 
                    disabled={isSubmitting}
                    className="cart-drawer__method-btn cart-drawer__method-btn--cod"
                  >
                    <span className="cart-drawer__method-icon">📦</span>
                    <div className="cart-drawer__method-text">
                      <strong>Cash on Delivery (COD)</strong>
                      <span>Order directly on site, pay at delivery</span>
                    </div>
                  </button>
                </div>

                <div className="cart-drawer__footer">
                  <div className="cart-drawer__summary-row cart-drawer__summary-row--total">
                    <span className="cart-drawer__summary-label">Total to Pay</span>
                    <span className="cart-drawer__summary-val">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
