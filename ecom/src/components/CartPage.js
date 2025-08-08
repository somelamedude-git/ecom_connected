import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ArrowLeft, Shield, ShoppingBag } from 'lucide-react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CartPage.css';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartitems, setcartitems] = useState([]);
  const [loading, setloading] = useState(true);

  const navigate = useNavigate();;
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cart/getItems', {
          withCredentials: true
        });
        setcartitems(response.data.cart);
      } catch (err) {
        console.log(err);
      } finally {
        setloading(false);
      }
    };
    loadData();
  }, []);

  const updateQuantity = async (item_id, item_size, set_quantity) => {
    try {
      const item = cartitems.find(i => i.product._id === item_id && i.size === item_size);
      if (item.quantity < set_quantity) {
        await axios.patch(`http://localhost:3000/cart/increment/${item_id}`,
          { size: item_size },
          { withCredentials: true }
        );
      } else if (item.quantity > set_quantity && set_quantity !== 0) {
        await axios.patch(`http://localhost:3000/cart/decrement/${item_id}`, {
          size: item_size
        }, {
          withCredentials: true
        });
      } else if (set_quantity === 0) {
        removeItem(item_id, item_size);
        return; // Exit early since removeItem handles state update
      }

      setcartitems(prev =>
        prev.map(i =>
          i.product._id === item_id && i.size === item_size
            ? { ...i, quantity: set_quantity }
            : i
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (item_id, item_size) => {
    try {
      // Update UI immediately (optimistic update)
      setcartitems(prev =>
        prev.filter(i => !(i.product._id === item_id && i.size === item_size))
      );

      // Make API call
      await axios.delete(`http://localhost:3000/cart/deleteItem/${item_id}`, {
        data: { size: item_size },
        withCredentials: true
      });
    } catch (err) {
      console.log(err);
      // If API call fails, you might want to revert the optimistic update
      // For now, we'll just log the error
      // You could implement error handling to restore the item if needed
    }
  };

const subtotal = !loading
  ? (cartitems || []).reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    )
  : 0;

  return (
    <div className="cart-container">
  
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
                  cartitems.map(item => (
                    <Link key={`${item.product._id}-${item.size}`} className='cart-item-link'>
                    <div className="cart-item">
                      <div className="itemcontent">
                        <img src={item.product.image} alt={item.product.name} className="itemimg" />
                        <div className="iteminfo">
                          <h3>{item.product.name}</h3>
                          <div>Size: {item.size} • Color: {item.product.color}</div>
                          <div className="itemprice">${item.product.price.toFixed(2)}</div>
                        </div>
                        <div className="itemactions">
                          <div className="qtycontrol">
                            <button onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}>
                              <Minus size={16} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}>
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            className="removeb"
                            onClick={() => removeItem(item.product._id, item.size)}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                    </Link>
                    
                  ))
                )}
              </div>

              <div className="cartsidebar">
                <div className="sidebarcard summary">
                  <h3>Order Summary</h3>
                  <div className="row">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="row total">
                    <span>Total</span><span>${subtotal.toFixed(2)}</span>
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