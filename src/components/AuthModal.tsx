import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot' | 'otp-request' | 'otp-verify'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // OTP States
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [showNotification, setShowNotification] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer Countdown for OTP Resend
  useEffect(() => {
    let interval: any;
    if (activeTab === 'otp-verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, timer]);

  // Reset form states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMessage('');
      setLoading(false);
      setOtp(new Array(6).fill(''));
      setShowNotification(false);
      
      // Animate modal open
      const ctx = gsap.context(() => {
        gsap.to(backdropRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.fromTo(
          contentRef.current,
          { scale: 0.95, y: 30, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }
        );
      }, modalRef);
      return () => ctx.revert();
    }
  }, [isOpen]);

  // Handle focus behavior on tab changes (e.g. focusing OTP input)
  useEffect(() => {
    if (activeTab === 'otp-verify') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [activeTab]);

  const handleClose = () => {
    gsap.to(contentRef.current, {
      scale: 0.95,
      y: 20,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  // OTP Input handlers
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Focus next input if value is entered
    if (val !== '' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Clear previous and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputsRef.current[index - 1]?.focus();
      } else if (otp[index] !== '') {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const triggerSendOtp = () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Generate a random 6-digit OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setTimer(60);
      setActiveTab('otp-verify');
      setShowNotification(true);
      // Auto-hide the mock email notification alert after 10s
      setTimeout(() => setShowNotification(false), 12000);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setError('Invalid OTP code. Please try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowNotification(false);
      const userName = email.split('@')[0];
      const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
      setSuccessMessage(`Welcome back, ${formattedName}!`);
      setTimeout(() => {
        onLogin({ name: formattedName, email });
        handleClose();
      }, 1200);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signin') {
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const userName = email.split('@')[0];
        const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
        setSuccessMessage(`Welcome back, ${formattedName}!`);
        setTimeout(() => {
          onLogin({ name: formattedName, email });
          handleClose();
        }, 1200);
      }, 1500);
    } else if (activeTab === 'signup') {
      if (!name || !email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          onLogin({ name, email });
          handleClose();
        }, 1200);
      }, 1500);
    } else if (activeTab === 'forgot') {
      if (!email) {
        setError('Please enter your email.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMessage('Password reset link sent to your email.');
        setTimeout(() => {
          setActiveTab('signin');
          setSuccessMessage('');
          setEmail('');
        }, 2000);
      }, 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="auth-modal" id="auth-modal-root">
      <div
        ref={backdropRef}
        className="auth-modal__backdrop"
        onClick={handleOverlayClick}
      />
      
      {/* Mock Gmail Notification Toast */}
      {showNotification && (
        <div className="otp-notification-toast">
          <div className="otp-notification-toast__icon">📩</div>
          <div className="otp-notification-toast__body">
            <span className="otp-notification-toast__title">Veloura Security</span>
            <span className="otp-notification-toast__msg">
              Your one-time login verification code is <strong>{generatedOtp}</strong>
            </span>
          </div>
          <button 
            className="otp-notification-toast__close" 
            onClick={() => setShowNotification(false)}
          >
            ✕
          </button>
        </div>
      )}

      <div ref={contentRef} className="auth-modal__content">
        <button className="auth-modal__close" onClick={handleClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {successMessage ? (
          <div className="auth-modal__success">
            <div className="auth-modal__success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="auth-modal__title">Success</h3>
            <p className="auth-modal__success-msg">{successMessage}</p>
          </div>
        ) : (
          <>
            <div className="auth-modal__header">
              {activeTab === 'signin' || activeTab === 'signup' ? (
                <div className="auth-modal__tabs">
                  <button
                    className={`auth-modal__tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('signin');
                      setError('');
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    className={`auth-modal__tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('signup');
                      setError('');
                    }}
                  >
                    Register
                  </button>
                </div>
              ) : activeTab === 'otp-request' ? (
                <h3 className="auth-modal__title">OTP Sign In</h3>
              ) : activeTab === 'otp-verify' ? (
                <h3 className="auth-modal__title">Enter Verification Code</h3>
              ) : (
                <h3 className="auth-modal__title">Reset Password</h3>
              )}
            </div>

            {/* OTP VERIFY CODE VIEW */}
            {activeTab === 'otp-verify' ? (
              <form className="auth-modal__form" onSubmit={handleVerifyOtp}>
                <p className="otp-subtitle">
                  We've sent a 6-digit code to <strong>{email}</strong>. Please enter it below.
                </p>
                
                {error && <div className="auth-modal__error-box">{error}</div>}

                <div className="otp-inputs-container">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputsRef.current[i] = el; }}
                      type="text"
                      className="otp-digit-input"
                      value={digit}
                      maxLength={1}
                      onChange={(e) => handleOtpChange(e.target, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      autoComplete="off"
                    />
                  ))}
                </div>

                <div className="otp-timer-box">
                  {timer > 0 ? (
                    <span className="otp-timer-text">Resend code in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      className="otp-resend-btn"
                      onClick={triggerSendOtp}
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-modal__submit-btn"
                >
                  {loading ? <span className="auth-modal__spinner" /> : 'Verify Code'}
                </button>

                <div className="auth-modal__back-trigger">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('otp-request');
                      setError('');
                    }}
                    className="auth-modal__link-btn"
                  >
                    Back to Email
                  </button>
                </div>
              </form>
            ) : activeTab === 'otp-request' ? (
              /* OTP EMAIL REQUEST VIEW */
              <form className="auth-modal__form" onSubmit={(e) => { e.preventDefault(); triggerSendOtp(); }}>
                <p className="otp-subtitle">
                  Secure passwordless login. We'll send a 6-digit code to your inbox.
                </p>
                
                {error && <div className="auth-modal__error-box">{error}</div>}

                <div className="auth-modal__input-group">
                  <input
                    type="email"
                    id="otp-email"
                    required
                    className="auth-modal__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                  />
                  <label htmlFor="otp-email" className="auth-modal__label">Gmail Address</label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-modal__submit-btn"
                >
                  {loading ? <span className="auth-modal__spinner" /> : 'Send Verification Code'}
                </button>

                <div className="auth-modal__back-trigger">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setError('');
                    }}
                    className="auth-modal__link-btn"
                  >
                    Or Sign In with Password
                  </button>
                </div>
              </form>
            ) : (
              /* STANDARD PASSWORDS VIEW */
              <form className="auth-modal__form" onSubmit={handleSubmit}>
                {error && <div className="auth-modal__error-box">{error}</div>}

                {activeTab === 'signup' && (
                  <div className="auth-modal__input-group">
                    <input
                      type="text"
                      id="reg-name"
                      required
                      className="auth-modal__input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="reg-name" className="auth-modal__label">Full Name</label>
                  </div>
                )}

                <div className="auth-modal__input-group">
                  <input
                    type="email"
                    id="auth-email"
                    required
                    className="auth-modal__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                  />
                  <label htmlFor="auth-email" className="auth-modal__label">Email Address</label>
                </div>

                {activeTab !== 'forgot' && (
                  <div className="auth-modal__input-group">
                    <input
                      type="password"
                      id="auth-password"
                      required
                      className="auth-modal__input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="auth-password" className="auth-modal__label">Password</label>
                  </div>
                )}

                {activeTab === 'signin' && (
                  <div className="auth-modal__row-links">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('forgot');
                        setError('');
                      }}
                      className="auth-modal__link-btn"
                    >
                      Forgot Password?
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('otp-request');
                        setError('');
                      }}
                      className="auth-modal__otp-toggle-btn"
                    >
                      Sign In with OTP
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-modal__submit-btn"
                >
                  {loading ? (
                    <span className="auth-modal__spinner" />
                  ) : activeTab === 'signin' ? (
                    'Sign In'
                  ) : activeTab === 'signup' ? (
                    'Create Account'
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                {activeTab === 'forgot' && (
                  <div className="auth-modal__back-trigger">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signin');
                        setError('');
                      }}
                      className="auth-modal__link-btn"
                    >
                      Back to Sign In
                    </button>
                  </div>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
