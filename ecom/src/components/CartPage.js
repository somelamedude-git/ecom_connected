import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, Clock, Truck, Shield, ShoppingBag } from 'lucide-react';
import Header from './Header';
import axios from 'axios';
import '../styles/CartPage.css';

function CartPage({ navigate }) {
  const [cartitems, setcartitems] = useState([]);
  const [deliopts, setdeliopts] = useState([]);
  const [selecdeli, setselcdeli] = useState('standard');
  const [promoCode, setpromocode] = useState('');
  const [promoon, setpromoon] = useState(false);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [itemsRes, optionsRes] = await Promise.all([
          fetch('cart wala api endpoint'),
          fetch('delivery options wala api endpoint'),
          // const deliopt = [
          // { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: 0 },
          // { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: 15.99 },
          // { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: 29.99 }
          // ];
        ]);
        const [items, options] = await Promise.all([itemsRes.json(), optionsRes.json()]);
        setcartitems(items);
        setdeliopts(options);
      } catch (err) {
        console.error('Error fetching cart data:', err);
      } finally {
        setloading(false);
      }
    }
    loadData();
  }, []);

  const updateQuantity = (id, qty) => {
    if (qty < 1) return removeItem(id);
    setcartitems(prev => prev.map(i => (i.id === id ? { ...i, quantity: qty } : i)));

  };

  const removeItem = id => {
    setcartitems(prev => prev.filter(i => i.id !== id));
//remove call
  };

//product page to cart page wala add krna he yahan nahi he

  const applyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'clique20') setpromoon(true);
  };

  const subtotal = cartitems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryPrice = deliopts.find(o => o.id === selecdeli)?.price || 0;
  const discount = promoon ? subtotal * 0.2 : 0;
  const total = subtotal + deliveryPrice - discount;

  return (
    <div className="cart-container">
      <Header currentPage="cart" navigate={navigate} cartCount={cartitems.length} />
      <div className="cart-main">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <button className="backb" onClick={() => navigate('/')}>
              <ArrowLeft size={20} /> Continue Shopping
            </button>

            <div className="cartgrid">
              <div>
                <h1>Shopping Cart</h1>
                {!cartitems.length ? (
                  <div className="emptycart">
                    <ShoppingBag size={64} className="emptycarticon" />
                    <h3>Your cart is empty</h3>
                    <p>Add items to begin</p>
                  </div>
                ) : (
                  //I'm take oarameters as name, id and image and then size n color
                  cartitems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="itemcontent">
                        <img src={item.image /*orwhatever goes here*/} alt={item.name} className="itemimg" />
                        <div className="iteminfo">
                          <h3>{item.name}</h3>
                          <div>Size: {item.size} • Color: {item.color}</div>
                          <div className="itemprice">${item.price.toFixed(2)}</div>
                        </div>
                        <div className="itemactions">
                          <div className="qtycontrol">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus size={16} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus size={16} /></button>
                          </div>
                          <button
                            className="removeb"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="cartsidebar">
                <div className="sidebarcard">
                  <h3><Truck size={20} /> Delivery Options</h3>
                  {deliopts.map(opt => (
                    <label key={opt.id}>
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.id}
                        checked={selecdeli === opt.id}
                        onChange={() => setselcdeli(opt.id)}
                      /> {opt.name} — {opt.time} — {opt.price ? `$${opt.price}` : 'Free'}
                    </label>
                  ))}
                </div>

                <div className="sidebarcard">
                  <h3>Promo Code</h3>
                  <div className="promo">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setpromocode(e.target.value)}
                      placeholder="Code"
                    />
                    <button onClick={applyPromo}>Apply</button>
                  </div>
                  {promoon && <div className="promoyippee">✓ CLIQUE20 applied</div>}
                </div>


                <div className="sidebarcard summary">
                  <h3>Order Summary</h3>
                  <div className="row">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="row">
                    <span>Delivery</span><span>{deliveryPrice ? `$${deliveryPrice}` : 'Free'}</span>
                  </div>
                  {promoon && (
                    <div className="row">
                      <span>Discount</span><span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="row total">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    className="checkoutb"
                    disabled={!cartitems.length}
                    onClick={() => alert('Proceed to checkout')}
                  >
                    Proceed to Checkout
                  </button>
                  <div className="securityline">
                    <Shield size={16} /> Secure checkout
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
