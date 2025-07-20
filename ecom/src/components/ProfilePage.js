import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ArrowLeft, User, Edit, Package, Heart, Star, CreditCard, Wallet, MapPin, Plus} from 'lucide-react';
import Header from './Header';
import '../styles/ProfilePage.css';

function ProfilePage({ loggedin, onToggleMenu, cartcount, wishlistcount }) {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const [cards, setcards] = useState([]);
  const [upiIds, setupiIds] = useState([]);
  const [addresses, setaddresses] = useState([]);
  const [creditpoints, setcreditpoints] = useState(0);

  useEffect(() => {
  async function fetchprofile() {
    try {
      const data = {
        user: {
          name: 'Camille Howe',
          joinYear: '2023',
          email: 'cam@mutiny.co',
          phone: '+1-555-1234',
          stylePref: 'Minimalist Cyberpunk',
          ordersCount: 8,
          wishlistcount: 5,
        },
        cards: [
          { number: '**** **** **** 1234', expiry: '12/26' },
          { number: '**** **** **** 5678', expiry: '07/25' },
        ],
        upiIds: [
          { id: 'cam@upi' },
          { id: 'cam.pay@bank' },
        ],
        addresses: [
          { label: 'Home', address: '42 Silicon Valley, CA' },
          { label: 'Work', address: '101 Mutiny Ave, SF' },
        ],
        creditpoints: 3200
      };

      setuser(data.user);
      setcards(data.cards);
      setupiIds(data.upiIds);
      setaddresses(data.addresses);
      setcreditpoints(data.creditpoints);
    } catch (e) {
      console.error(e);
    }
  }

  fetchprofile();
}, []);

  // useEffect(() => {
  //   async function fetchprofile() {
  //     try {
  //       //idhar api
  //       setuser(data.user); setcards(data.cards);setupiIds(data.upiIds);setaddresses(data.addresses);
  //       setcreditpoints(data.creditpoints);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  //   fetchprofile();
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
            <h3>{user.ordersCount} Orders</h3>
          </div>
          <div className="statcard" onClick={() => nav('/wishlist')}>
            <Heart size={32} />
            <h3>{user.wishlistcount} Wishlist Items</h3>
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
