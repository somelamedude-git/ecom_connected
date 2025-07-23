import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Trash2, Clock, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/WishlistPage.css';

function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('api');
        if (!res.ok) throw new Error('Fetch failed T^T');
        setWishlist(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
//saved for later wala part
  const remove = async (id, fromSaved = false) => {
    try {
      await fetch();
      const updater = fromSaved
        ? () => setSaved(saved.filter(i => i.id !== id))
        : () => setWishlist(wishlist.filter(i => i.id !== id));
      updater();
    } catch (e) {
      console.error(e);
    }
  };

  const move = (item, toSaved) => {
    if (toSaved) {
      setSaved([...saved, item]);
      setWishlist(wishlist.filter(i => i.id !== item.id));
    } else {
      setWishlist([...wishlist, item]);
      setSaved(saved.filter(i => i.id !== item.id));
    }
  };

  const addCart = (item) => {
    fetch().catch(console.error);
    alert(`${item.name} added to cart`);
  };

  const addAll = () => {
    wishlist.filter(i => i.inStock).forEach(addCart);
    alert('Added all in-stock items to cart!');
  };

  const total = wishlist.reduce((sum, i) => sum + i.price, 0);
  const inStockCount = wishlist.filter(i => i.inStock).length;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="cart-container">
      <Header navigate={navigate} currentPage="wishlist" cartCount={0} wishlistCount={wishlist.length} /> {/*Fix this*/}

      <div className="cart-main">
        <button className="backb" onClick={() => navigate('/')}>
          <ArrowLeft size={20}/> Continue Shopping
        </button>

        <div className="cartgrid">
          <div>
            <h1>My Wishlist</h1>
            {!wishlist.length ? (
              <div className="emptycart">
                <Heart className="emptycarticon" size={64}/>
                <h3>Your wishlist is empty</h3>
                <p className="emptycarttext">Save items you love for later</p>
              </div>
            ) : (
              wishlist.map(item => (
                <div key={item.id} className="cartitem">
                  <div className="itemcontent">
                    <img src={item.image} alt="" className="itemimg" />
                    <div className="iteminfo">
                      <h3>{item.name}</h3>
                      <div>Size: {item.size} • Color: {item.color}</div>
                      <div className="itemprice">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="itemactions">
                      <button className="addtocartb" disabled={!item.inStock} onClick={() => addCart(item)}>
                        <ShoppingBag size={16}/> Add to Cart
                      </button>
                      {!item.inStock && (
                        <button className="moveb" onClick={() => move(item, true)}>
                          <Clock size={14}/> Save for Later
                        </button>
                      )}
                      <button className="removeb" onClick={() => remove(item.id)}>
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {saved.length > 0 && (
              <>
                <div className="aflsec">
                  <div className="sectionheader">
                    <Clock size={24}/> <h2 className="sectiontitle">Saved for Later ({saved.length})</h2>
                  </div>
                  {saved.map(item => (
                    <div key={item.id} className="cartitem">
                      <div className="itemcontent">
                        <img src={item.image} alt="" className="itemimg" />
                        <div className="iteminfo">
                          <h3>{item.name}</h3>
                          <div>Size: {item.size}</div>
                          <div className="itemprice">${item.price.toFixed(2)}</div>
                        </div>
                        <div className="itemactions">
                          <button className="moveb moveToWL" onClick={() => move(item, false)}>
                            <RotateCcw size={14}/> Move to Wishlist
                          </button>
                          <button className="removeb" onClick={() => remove(item.id, true)}>
                            <Trash2 size={20}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="cartsidebar">
            <div className="sidebarcard">
              <h3><Heart size={20}/> Wishlist Summary</h3>
              <div className="summary">
                <div className="row"><span>Total Items</span><span>{wishlist.length}</span></div>
                <div className="row"><span>In Stock</span><span>{inStockCount}</span></div>
                <div className="row"><span>Saved for Later</span><span>{saved.length}</span></div>
                <div className="row total"><span>Total Value</span><span className="totalval">${total.toFixed(2)}</span></div>
              </div>
              <button className="checkoutb" disabled={!inStockCount} onClick={addAll}>
                Add All to Cart ({inStockCount})
              </button>
              <button className="secondaryb" onClick={() => navigate('/products')}>
                Continue Shopping
              </button>
            </div>
            <div className="sidebarcard">
              <h3>Recently Viewed</h3>
              <p className="emptycarttext">Items you hv recently viewed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
