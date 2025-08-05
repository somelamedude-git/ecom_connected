import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Search, User, ShoppingBag, Menu, Heart, 
  Package, BarChart3, Plus, Store, Settings 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/clique_logo.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Header.css';

function Header({ menumove }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loggedin, setLoggedin] = useState(false);
  const [userType, setUserType] = useState('Buyer');
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    const fetchData = async() => {
      try {
        const res_login_status = await axios.get('http://localhost:3000/user/verifyLogin', {
          withCredentials: true
        });
        
        if (res_login_status.data.isLoggedIn) {
          setLoggedin(true);
          setUserType(res_login_status.data.userType || 'Buyer'); 
          
          if (res_login_status.data.userType === 'Buyer') {
            const res_CWL = await axios.get('http://localhost:3000/user/getCWL', {
              withCredentials: true
            });
            setWishlistCount(res_CWL.data.wish_length);
            setCartCount(res_CWL.data.cart_length);
          } else if (res_login_status.data.userType === 'seller') {
            const res_seller_stats = await axios.get('http://localhost:3000/seller/stats', {
              withCredentials: true
            });
            setSellerStats(res_seller_stats.data);
          }
        } else {
          setLoggedin(false);
        }
      } catch(error) {
        console.log(error);
        setLoggedin(false);
        setCartCount(0);
        setWishlistCount(0);
      }
    };

    fetchData();
  }, []);

  const currentpath = useMemo(() => {
    const path = location.pathname === '/' ? 'home' : location.pathname.slice(1);
    return path || 'home';
  }, [location.pathname]);

  const safenav = (path) => {
    if (typeof path === 'string') {
      try {
        navigate(path);
      } catch (error) {
        console.error(`Navigation error: ${path}`, error);
      }
    }
  };

  const activated = (page) => currentpath === page;
  const navbclasss = (page) => `navLink${activated(page) ? ' act' : ''}`;
  const iconclass = (page) => `iconb${activated(page) ? ' aicon' : ''}`;

  const BuyerHeader = () => (
    <header className="header">
      <div className="headercontent">
        <div
          className="logo"
          onClick={() => safenav('/')}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img src={logo} alt="CLIQUE Logo" className="logoImage" />
          CLIQUE
        </div>

        <nav className="nav hiddenm">
          <div className="navlinks">
            {['home', 'products', 'about', 'cart'].map((page) => (
              <button
                key={page}
                className={navbclasss(page)}
                onClick={() => safenav(`/${page === 'home' ? '' : page}`)}
                onMouseEnter={(e) => !activated(page) && (e.currentTarget.style.color = '#f9fafb')}
                onMouseLeave={(e) => !activated(page) && (e.currentTarget.style.color = '#ffffff')}
                style={{ cursor: activated(page) ? 'default' : 'pointer' }}
              >
                {page === 'about' ? 'About Us' : page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <div className="headerActions">
          <button className="iconb" onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
            <Search size={20} />
          </button>

          <button onClick={() => safenav('/wishlist')} className={iconclass('wishlist')}>
            <Heart size={20} />
            <span className="cartthingy">{wishlistCount}</span>
          </button>

          <button onClick={() => safenav('/profile')} className={iconclass('profile')}>
            <User size={20} />
          </button>

          <button onClick={() => safenav('/cart')} className={iconclass('cart')}>
            <ShoppingBag size={20} />
            <span className="cartthingy">{cartCount}</span>
          </button>

          {loggedin ? (
            <button onClick={menumove} className="iconb" onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
              <Menu size={20} />
            </button>
          ) : (
            <>
              <button onClick={() => safenav('/login')} className="authibutton">Login</button>
              <button onClick={() => safenav('/signup')} className="signUpButton">Sign up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );

  // Seller Header Component
  const SellerHeader = () => (
    <header className="header">
      <div className="headercontent">
        <div
          className="logo"
          onClick={() => safenav('/seller/dashboard')}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img src={logo} alt="CLIQUE Logo" className="logoImage" />
          <span>CLIQUE</span>
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#fbbf24',
            marginLeft: '8px',
            padding: '2px 6px',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '4px'
          }}>
            SELLER
          </span>
        </div>

        <nav className="nav hiddenm">
          <div className="navlinks">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'products', label: 'My Products' },
              { key: 'orders', label: 'Orders' },
              { key: 'analytics', label: 'Analytics' }
            ].map((page) => (
              <button
                key={page.key}
                className={navbclasss(page.key)}
                onClick={() => safenav(`/seller/${page.key === 'dashboard' ? '' : page.key}`)}
                onMouseEnter={(e) => !activated(page.key) && (e.currentTarget.style.color = '#f9fafb')}
                onMouseLeave={(e) => !activated(page.key) && (e.currentTarget.style.color = '#ffffff')}
                style={{ cursor: activated(page.key) ? 'default' : 'pointer' }}
              >
                {page.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="headerActions">
          {/* Quick Add Product Button */}
          <button 
            onClick={() => safenav('/seller/add-product')} 
            className="iconb"
            style={{
              backgroundColor: '#fbbf24',
              color: '#000',
              borderRadius: '6px',
              padding: '8px 12px',
              fontWeight: '500',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f59e0b';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fbbf24';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={16} />
            Add Product
          </button>

          <button onClick={() => safenav('/seller/products')} className={iconclass('products')}>
            <Package size={20} />
            <span className="cartthingy">{sellerStats.totalProducts}</span>
          </button>

          {/* Orders Count */}
          <button onClick={() => safenav('/seller/orders')} className={iconclass('orders')}>
            <ShoppingBag size={20} />
            <span className="cartthingy" style={{
              backgroundColor: sellerStats.pendingOrders > 0 ? '#ef4444' : '#6b7280'
            }}>
              {sellerStats.pendingOrders}
            </span>
          </button>

          {/* Analytics */}
          <button onClick={() => safenav('/seller/analytics')} className={iconclass('analytics')}>
            <BarChart3 size={20} />
          </button>

          {/* Seller Store */}
          <button onClick={() => safenav('/seller/store')} className={iconclass('store')}>
            <Store size={20} />
          </button>

          {/* Profile & Settings */}
          <button onClick={() => safenav('/seller/profile')} className={iconclass('profile')}>
            <User size={20} />
          </button>

          {loggedin && (
            <button onClick={menumove} className="iconb" onMouseEnter={(e) => e.target.style.color = '#ffffff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
              <Menu size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );

  if (!loggedin) {
    return <BuyerHeader />; 
  }

  return userType === 'seller' ? <SellerHeader /> : <BuyerHeader />;
}

Header.propTypes = {
  menumove: PropTypes.func
};

export default Header;