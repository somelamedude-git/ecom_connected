import React, { useState } from 'react';
import { Search, User, ShoppingBag, Minus, Plus, Trash2, ArrowLeft, Clock, Truck, Shield, Menu } from 'lucide-react';
import jacket from '../jacket.jpg';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff'
  },
  header: {
    backgroundColor: '#000000',
    borderBottom: '1px solid #374151'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1
  },
  navLinks: {
    display: 'flex',
    gap: '32px'
  },
  navLink: {
    color: '#d1d5db',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'color 0.3s ease'
  },
  activeNavLink: {
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: '500'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    position: 'relative'
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    color: '#000000',
    fontSize: '12px',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  authButton: {
    background: 'none',
    border: 'none',
    color: '#d1d5db',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'color 0.3s ease'
  },
  signUpButton: {
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    color: '#000000',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease'
  },
  mainContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px 16px'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9ca3af',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '32px',
    transition: 'all 0.3s ease'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '32px'
  },
  cartSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  pageTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '32px'
  },
  emptyCart: {
    textAlign: 'center',
    padding: '64px 0'
  },
  emptyCartIcon: {
    width: '64px',
    height: '64px',
    color: '#4b5563',
    margin: '0 auto 16px'
  },
  emptyCartTitle: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#9ca3af',
    marginBottom: '8px'
  },
  emptyCartText: {
    color: '#6b7280'
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  cartItem: {
    backgroundColor: '#111827',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #374151'
  },
  itemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  itemImage: {
    width: '96px',
    height: '96px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  itemName: {
    fontSize: '18px',
    fontWeight: '600'
  },
  itemMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#9ca3af'
  },
  itemPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '8px'
  },
  quantityButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  quantityText: {
    width: '32px',
    textAlign: 'center',
    fontWeight: '500'
  },
  removeButton: {
    padding: '8px',
    color: '#9ca3af',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sidebarCard: {
    backgroundColor: '#111827',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #374151'
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  deliveryOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  deliveryOption: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  radioInput: {
    width: '16px',
    height: '16px',
    accentColor: 'hsl(45, 100%, 85%)',
    marginRight: '12px'
  },
  deliveryDetails: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deliveryName: {
    fontWeight: '500'
  },
  deliveryTime: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#9ca3af',
    gap: '4px'
  },
  deliveryPrice: {
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: '600'
  },
  promoSection: {
    display: 'flex',
    gap: '8px'
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '12px',
    color: '#ffffff',
    fontSize: '16px'
  },
  promoButton: {
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    color: '#000000',
    padding: '12px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease'
  },
  promoSuccess: {
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '14px',
    marginTop: '8px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  summaryLabel: {
    color: '#9ca3af'
  },
  summaryValue: {
    color: '#ffffff'
  },
  summaryDiscount: {
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  summaryTotal: {
    borderTop: '1px solid #374151',
    paddingTop: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  totalPrice: {
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  checkoutButton: {
    width: '100%',
    background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)',
    color: '#000000',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginTop: '24px',
    transition: 'opacity 0.3s ease'
  },
  securityNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
    fontSize: '14px',
    color: '#9ca3af'
  }
};

function CartPage({ tolanding, toabout, toproducts, onNavigateToProfile, loggedin, sidemenu }) {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Leather Jacket",
      price: 299.99,
      quantity: 1,
      image: {jacket},
      size: "M",
      color: "Black"
    }
  ]);

  const [delselect, setdelselect] = useState('standard');
  const [discountcode, setdiscount] = useState('');
  const [discountapplied, setdiscountapplied] = useState(false);

  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: 15.99 },
    { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: 29.99 }
  ];

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const applydiscount = () => {
    if (discountcode.toLowerCase() === 'clique20') {
      setdiscountapplied(true);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryPrice = deliveryOptions.find(option => option.id === delselect)?.price || 0;
  const discount = discountapplied ? subtotal * 0.2 : 0;
  const total = subtotal + deliveryPrice - discount;

  return (
    <div style={styles.container}>
        //headerrrrrrr
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>CLIQUE</div>
          
          <nav style={styles.nav} className="mobile-hidden">
            <div style={styles.navLinks}>
              <button 
                onClick={tolanding}
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
              >
                Home
              </button>
              <button 
                onClick={toproducts}
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
              >
                Products
              </button>
              <button 
                onClick={toabout}
                style={styles.navLink}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = '#d1d5db'}
              >
                About Us
              </button>
              <a href="#" style={styles.activeNavLink}>Cart</a>
            </div>
          </nav>
          
          <div style={styles.headerActions}>
            <button style={styles.iconButton}>
              <Search size={20} />
            </button>
            <button 
              onClick={onNavigateToProfile}
              style={styles.iconButton}
            >
              <User size={20} />
            </button>
            <div style={styles.iconButton}>
              <ShoppingBag size={20} />
              <span style={styles.cartBadge}>{cartItems.length}</span>
            </div>
            {loggedin ? (
              <button 
                onClick={sidemenu}
                style={styles.iconButton}
              >
                <Menu size={20} />
              </button>
            ) : (
              <>
                <button style={styles.authButton}>Login</button>
                <button style={styles.signUpButton}>Sign up</button>
              </>
            )}
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>

        <button 
          onClick={tolanding}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)';
            e.target.style.webkitBackgroundClip = 'text';
            e.target.style.webkitTextFillColor = 'transparent';
            e.target.style.backgroundClip = 'text';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.webkitBackgroundClip = 'initial';
            e.target.style.webkitTextFillColor = 'initial';
            e.target.style.backgroundClip = 'initial';
            e.target.style.color = '#9ca3af';
          }}
        >
          <ArrowLeft size={20} />
          <span>Continue Shopping</span>
        </button>

        <div style={styles.contentGrid} className="mobile-flex-col">
          //cart
          <div style={styles.cartSection}>
            <h1 style={styles.pageTitle}>Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
              <div style={styles.emptyCart}>
                <ShoppingBag style={styles.emptyCartIcon} />
                <h3 style={styles.emptyCartTitle}>Your cart is empty</h3>
                <p style={styles.emptyCartText}>Add some items to get started</p>
              </div>
            ) : (
              <div style={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.id} style={styles.cartItem}>
                    <div style={styles.itemContent}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={styles.itemImage}
                      />
                      
                      <div style={styles.itemDetails}>
                        <h3 style={styles.itemName}>{item.name}</h3>
                        <div style={styles.itemMeta}>
                          <span>Size: {item.size}</span>
                          <span>Color: {item.color}</span>
                        </div>
                        <p style={styles.itemPrice}>${item.price}</p>
                      </div>

                      <div style={styles.itemActions}>
                        <div style={styles.quantityControl}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={styles.quantityButton}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <Minus size={16} />
                          </button>
                          <span style={styles.quantityText}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={styles.quantityButton}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          style={styles.removeButton}
                          onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            //order
          <div style={styles.sidebar}>
            //delivery``
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>
                <Truck size={20} style={{background: 'linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}} />
                Delivery Options
              </h3>
              <div style={styles.deliveryOptions}>
                {deliveryOptions.map((option) => (
                  <label key={option.id} style={styles.deliveryOption}>
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={delselect === option.id}
                      onChange={(e) => setdelselect(e.target.value)}
                      style={styles.radioInput}
                    />
                    <div style={styles.deliveryDetails}>
                      <div>
                        <div style={styles.deliveryName}>{option.name}</div>
                        <div style={styles.deliveryTime}>
                          <Clock size={12} />
                          {option.time}
                        </div>
                      </div>
                      <span style={styles.deliveryPrice}>
                        {option.price === 0 ? 'Free' : `$${option.price}`}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

                //discounts
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>Promo Code</h3>
              <div style={styles.promoSection}>
                <input
                  type="text"
                  value={discountcode}
                  onChange={(e) => setdiscount(e.target.value)}
                  placeholder="Enter code"
                  style={styles.promoInput}
                />
                <button
                  onClick={applydiscount}
                  style={styles.promoButton}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Apply
                </button>
              </div>
              {discountapplied && (
                <p style={styles.promoSuccess}>✓ CLIQUE20 applied - 20% off</p>
              )}
            </div>

              //order
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>Order Summary</h3>
              <div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Subtotal</span>
                  <span style={styles.summaryValue}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Delivery</span>
                  <span style={styles.summaryValue}>{deliveryPrice === 0 ? 'Free' : `$${deliveryPrice.toFixed(2)}`}</span>
                </div>
                {discountapplied && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryDiscount}>Discount (20%)</span>
                    <span style={styles.summaryDiscount}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={styles.summaryTotal}>
                  <span>Total</span>
                  <span style={styles.totalPrice}>${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                style={{...styles.checkoutButton, opacity: cartItems.length === 0 ? 0.5 : 1}}
                disabled={cartItems.length === 0}
                onMouseEnter={(e) => {
                  if (cartItems.length > 0) e.target.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  if (cartItems.length > 0) e.target.style.opacity = '1';
                }}
              >
                Proceed to Checkout
              </button>

              <div style={styles.securityNote}>
                <Shield size={16} />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;