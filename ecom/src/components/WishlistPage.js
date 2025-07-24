import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/WishlistPage.css';
import axios from 'axios';

function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function load() {
  //     try {
  //       const res = await axios.get('http://localhost:3000/wishlist/getItems', {  
  //         withCredentials: true,
  //       });
  //       setWishlist(res.data.wish_items_info); // res.data is giving us an array, jismein we have item and inStock, item further has the product and size
  //     } catch (e) {
  //       console.error(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   load();
  // }, []);

  useEffect(() => {
  async function load() {
    try {
      const mockData = [
  {
    inStock: true,
    item: {
      size: "M",
      product: {
        _id: "1",
        name: "Midnight Hoodie",
        color: "Black",
        price: 59.99,
        image: "https://via.placeholder.com/100?text=Hoodie"
      }
    }
  },
  {
    inStock: false,
    item: {
      size: "L",
      product: {
        _id: "2", 
        name: "Midnight Hoodie",
        color: "Black",
        price: 59.99,
        image: "https://via.placeholder.com/100?text=Hoodie"
      }
    }
  },
  {
    inStock: true,
    item: {
      size: "S",
      product: {
        _id: "3",
        name: "Skyline T-shirt",
        color: "Blue",
        price: 24.50,
        image: "https://via.placeholder.com/100?text=T-shirt"
      }
    }
  },
  {
    inStock: true,
    item: {
      size: "M",
      product: {
        _id: "4", // same product ID as above
        name: "Skyline T-shirt",
        color: "Blue",
        price: 24.50,
        image: "https://via.placeholder.com/100?text=T-shirt"
      }
    }
  },
  {
    inStock: true,
    item: {
      size: "XS",
      product: {
        _id: "5",
        name: "Cloud Joggers",
        color: "Gray",
        price: 39.99,
        image: "https://via.placeholder.com/100?text=Joggers"
      }
    }
  },

  {
    inStock: true,
    item: {
      size: "XXXXXL",
      product: {
        _id: "6",
        name: "Midnight Hoodie",
        color: "Black",
        price: 59.99,
        image: "https://via.placeholder.com/100?text=Hoodie"
      }
    }
  },

  
];


      // Simulate async
      await new Promise(resolve => setTimeout(resolve, 500));
      setWishlist(mockData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  load();
}, []);


  const remove = async (product_id, item_size) => {
    try {
//       await axios.delete(`http://localhost:3000/wishlist/deleteItem/${product_id}`, {
//   data: { size: item_size },
//   withCredentials: true
// });
      setWishlist(wishlist.filter(i => !(i.item.product._id == product_id && i.item.size===item_size)));
    } catch (e) {
      console.error(e);
    }
  };

  const addCart = (item) => {
    // fetch().catch(console.error); 
    remove(item.item.product._id, item.item.size);
    alert(`${item.item.product.name} added to cart`);
  };

  const addAll = () => {
    wishlist.filter(i => i.inStock).forEach(addCart);
    alert('Added all in-stock items to cart!');
  };

  const total = wishlist.reduce((sum, i) => sum + i.item.product.price, 0);
  const inStockCount = wishlist.filter(i => i.inStock).length;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="cart-container">
      <Header
        navigate={navigate}
        currentPage="wishlist"
        cartCount={0}
        wishlistCount={wishlist.length}
      /> {/* Fix this */}

      <div className="cart-main">
        <button className="backb" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Continue Shopping
        </button>

        <div className="cartgrid">
          <div>
            <h1>My Wishlist</h1>
            {!wishlist.length ? (
              <div className="emptycart">
                <Heart className="emptycarticon" size={64} />
                <h3>Your wishlist is empty</h3>
                <p className="emptycarttext">Save items you love for later</p>
              </div>
            ) : (
              wishlist.map(item => (
                <div key={item.item.product._id} className="cartitem">
                  <div className="itemcontent">
                    <img
                      src={item.item.product.image}
                      alt=""
                      className="itemimg"
                    />
                    <div className="iteminfo">
                      <h3>{item.item.product.name}</h3>
                      <div>
                        Size: {item.item.size} • Color:{' '}
                        {item.item.product.color}
                      </div>
                      <div className="itemprice">
                        ${item.item.product.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="itemactions">
                      <button
                        className="addtocartb"
                        disabled={!item.inStock}
                        onClick={() => addCart(item)}
                      >
                        <ShoppingBag size={16} /> Add to Cart
                      </button>
                      <button
                        className="removeb"
                        onClick={() => remove(item.item.product._id, item.item.size)}
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
              <h3>
                <Heart size={20} /> Wishlist Summary
              </h3>
              <div className="summary">
                <div className="row">
                  <span>Total Items</span>
                  <span>{wishlist.length}</span>
                </div>
                <div className="row">
                  <span>In Stock</span>
                  <span>{inStockCount}</span>
                </div>
                <div className="row total">
                  <span>Total Value</span>
                  <span className="totalval">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="checkoutb"
                disabled={!inStockCount}
                onClick={addAll}
              >
                Add All to Cart ({inStockCount})
              </button>
              <button
                className="secondaryb"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>

            <div className="sidebarcard">
              <h3>Recently Viewed</h3>
              <p className="emptycarttext">Items you have recently viewed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
