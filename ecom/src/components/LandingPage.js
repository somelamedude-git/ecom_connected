import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/LandingPage.css';
import axios from 'axios';

function LandingPage({ onToggleMenu, }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCWL = axios.get('http://localhost:3000/user/getCWL', {
    withCredentials: true
  });

  const fetchLoginStatus = axios.get('http://localhost:3000/user/verifyLogin', {
    withCredentials: true
  });

  useEffect(() => { 
    
        Promise.all([fetchCWL, fetchLoginStatus])
        .then(([cwlRes, loginRes])=>{
            setWishlistCount(cwlRes.data.wish_length);
            setCartCount(cwlRes.data.cart_length);
            setIsLoggedIn(loginRes.data.isLoggedIn);
        })
        .catch(err=>console.log(err));
  }, []);

  return (
    <div className="landing-container">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        loggedin={isLoggedIn}
        menumove={onToggleMenu}
      />

      <main className="landinghero">
        <div className="herokaoverlay" />

        <div className="herocontent">
          <button className="herothingy" onClick={() => navigate('/products')}>
            Latest Collection 2025
          </button>

          <h1 className="heroheadline">
            <span className="headlinestatic">People are going to Stare -</span>
            <span className="headline-dynamic typing-animation">Make it Worth the While</span>
          </h1>

          <p className="herosubtit">
            Unveiling a fashion destination where trends blend seamlessly with your individual
            style aspirations. Discover today!
          </p>

          <div className="herocta">
            <button
              className="ctaprim"
              onClick={() => navigate('/products')}
            >
              New Collection
            </button>
            <button
              className="ctasec"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
