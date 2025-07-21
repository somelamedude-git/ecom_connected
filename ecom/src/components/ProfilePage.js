import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Edit, Package, Heart, Star, CreditCard, Wallet, MapPin, Plus } from 'lucide-react';
import Header from './Header';
import axios from 'axios';
import '../styles/ProfilePage.css';

function ProfilePage({ loggedin, onToggleMenu, cartcount, wishlistcount }) {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const [cards, setcards] = useState([]);
  const [upiIds, setupiIds] = useState([]); // This as well
  const [creditpoints, setcreditpoints] = useState(0); // Will set this up later
  const [addresses, setaddresses] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  useEffect(()=>{
    const fetchProfile = async()=>{
      try{
        const res = await axios.get('http://localhost:3000/user/profile', {
          withCredentials:true
        });

        setuser(res.data.user);
        setaddresses(res.data.addresses);

        const res_CWL = await axios.get('http://localhost:3000/user/getCWL', {
          withCredentials:true
        });

        setWishlistCount(res_CWL.data.wish_length);
        setOrdersCount(res_CWL.data.orderHistory_length);
      } catch(error){
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const mockUser = {
  //         name: 'Ada Lovelace',
  //         joinYear: '2022',
  //         ordersCount: 8,
  //         wishlistcount: 5,
  //         email: 'ada.lovelace@example.com',
  //         phone: '+91 7814345388',
  //         stylePref: 'Cyberpunk',
  //         username: 'lovelace42',
  //         age: 29,
  //       };

  //       setuser(mockUser);
  //       setcreditpoints(420);
  //       setcards([
  //         { number: '**** **** **** 1234', expiry: '12/26' },
  //         { number: '**** **** **** 5678', expiry: '11/25' },
  //       ]);
  //       setupiIds([
  //         { id: 'ada@ybl' },
  //         { id: 'lovelace@upi' },
  //       ]);
  //       setaddresses([
  //         { label: 'Home', address: '42 Binary Street' },
  //         { label: 'Work', address: '101 Code City' },
  //       ]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const adding = (setter, item) =>
    setter(prev => [...prev, item]);

  const nav = (path) => typeof path === 'string' && navigate(path);

  if (!user) return <div className="loading">Loading profile…</div>;

  return (
    <div className="profile-container">
      <Header
        currentPage="profile"
        cartcount={cartcount}
        wishlistcount={wishlistcount}
        loggedin={loggedin}
        menumove={onToggleMenu}
      />

      <div className="profile-main">
        <button className="backb" onClick={() => nav('/')}>
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="profileheader">
          <div className="profileinfo">
            <div className="avatar"><User size={48} /></div>
            <div>
              <h1 className="profilename">{user.name}</h1>
              <p className="username">@{user.username}</p>
              <p className="membersince">Member since {user.joinYear}</p>
              <button className="editb" onClick={() => nav('/profile/edit')}>
                <Edit size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="profilestats">
          <div className="statcard" onClick={() => nav('/orders')}>
            <Package size={32} />
            <h3>{ordersCount} Orders</h3>
          </div>
          <div className="statcard" onClick={() => nav('/wishlist')}>
            <Heart size={32} />
            <h3>{wishlistCount} Wishlist Items</h3>
          </div>
          <div className="statcard">
            <Star size={32} />
            <h3>{creditpoints} Points</h3>
          </div>
        </div>

        <div className="profilesec">
          <h2>Personal Information</h2>
          <div className="infogrid">
            <div className="infoitem">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="infoitem">
              <label>Phone</label>
              <p>{user.phone}</p>
            </div>
            <div className="infoitem">
              <label>Preferred Style</label>
              <p>{user.stylePref}</p>
            </div>
            <div className="infoitem">
              <label>Age</label>
              <p>{user.age}</p>
            </div>
          </div>
        </div>

        {[
          { title: 'Saved Cards', icon: CreditCard, data: cards, setter: setcards, key: 'number' },
          { title: 'Saved UPI IDs', icon: Wallet, data: upiIds, setter: setupiIds, key: 'id' },
          { title: 'Saved Addresses', icon: MapPin, data: addresses, setter: setaddresses, key: 'address' }
        ].map((section, idx) => (
          <div key={idx} className="profilesec">
            <div className="secheader">
              <h2><section.icon size={24} /> {section.title}</h2>
              <button className="addb" onClick={() => adding(section.setter, section.title === 'Saved Addresses' ? { label: 'New', address: '...' } : { [section.key]: '...' })}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="list">
              {section.data.map((item, index) => (
                <div key={index} className="listitem">
                  <span>{item[section.key]}</span>
                  {item.expiry && <span>{item.expiry}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
