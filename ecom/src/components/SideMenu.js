import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {X, Venus, Heart, ShoppingBag, Mars, User, Footprints, Watch, Palette, LogOut} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import '../styles/SideMenu.css';

function SideMenu({isopen, onclose}) {
  const [profile, setprofile] = useState({name:'', status:''});
  const [counts, setcounts] = useState({wish_length:0, cart_length:0});
  const navigate = useNavigate();
  const categories = [
    {name:"Women's", icon:Venus},
    {name:"Men's", icon:Mars},
    {name:"Footwear", icon:Footprints},
    {name:"Accessories", icon:Watch},
    {name:"Makeup", icon:Palette}
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get('http://localhost:3000/user/profile');
        const countsRes = await axios.get('http://localhost:3000/user/getCWL');
        const user = profileRes.data.user || {};
        setprofile({
          name:user.name || 'Guest',
          status:'Member',
       });
        setcounts({
          wish_length:countsRes.data.wish_length,
          cart_length:countsRes.data.cart_length,
       });
     } catch (error) {
        console.error('Error loading side menu data:', error);
     }
   };
    fetchData();
 }, []);

  const handleNavigate = (path) => {
    navigate(path);
    onclose();
 };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/user/logout');
      navigate('/');
      onclose();
    } catch (error) {
      console.error('Error logging out:', error);
      onclose();
    }
  };

  return (
    <>
      <div className={`side-overlay ${isopen ? 'open' :''}`} onClick={onclose} />

      <div className={`side-menu ${isopen ? 'open' :''}`}>
        <div className="menucontent">

          <div className="menuheader">
            <h2 className="menutitle">Menu</h2>
            <button className="closeb" onClick={onclose}>
              <X size={24} />
            </button>
          </div>

          <div className="profilesec">
            <div className="profileinfo">
              <div className="avatar">
                <User size={32} color="#000000" />
              </div>
              <div className="profiledetails">
                <h3 className="profilename">{profile.name}</h3>
                <p className="profilestatus">{profile.status}</p>
              </div>
            </div>
            <button className="viewprofileb" onClick={() => handleNavigate('/profile')}>
              View profile
            </button>
          </div>

          <div className="sec">
            <h4 className="sectitle">Quick Actions</h4>
            <div className="menulist">
              <button className="menuitem" onClick={() => handleNavigate('/wishlist')}>
                <Heart size={20} />
                <span>Wishlist ({counts.wish_length})</span>
              </button>
              <button className="menuitem" onClick={() => handleNavigate('/cart')}>
                <ShoppingBag size={20} />
                <span>Cart ({counts.cart_length})</span>
              </button>
            </div>
          </div>

          <div className="sec">
            <h4 className="sectitle">Categories</h4>
            <div className="menulist">
              {categories.map((category, i) => (
                <button
                  key={i}
                  className="menuitem"
                  onClick={() => handleNavigate(`/products?category=${category.name}`)}
                >
                  <category.icon size={20} />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ef4444';
                e.target.style.color = '#ffffff';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#ef4444';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateY(0) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'translateY(-1px) scale(1)';
              }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default SideMenu;