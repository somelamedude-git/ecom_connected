import React, { useState, useEffect } from 'react';
import {ArrowLeft, Heart, ShoppingBag, Star, Plus, Minus, Share, Shield, Truck, RotateCcw} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import '../styles/singleProduct.css'

function ProductDescriptionPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [stockInfo, setStockInfo] = useState({});

//   const fetchProduct = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/products/${productId}`);
//       const { product_info, product_sizes } = response.data;
      
//       setProduct(product_info);
//       setAvailableSizes(product_sizes);
//       setStockInfo(product_info.stock || {});
//       setSelectedSize(product_sizes[0] || '');
//     } catch (err) {
//       setError('Failed to load product details. Please try again later.');
//       console.error('Error fetching product:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (productId) {
//       fetchProduct();
//     }
//   }, [productId]);

  // Mock data fallback for development
  useEffect(() => {
    const mockData = {
      _id: '507f1f77bcf86cd799439011',
      name: 'lux leather jacket',
      description: 'Crafted with genuine Italian leather, this jacket is the perfect fusion of style and durability.',
      productImages: 'https://via.placeholder.com/600x800?text=Main+Image',
      price: 249.99,
      stock: { 'S': 5, 'M': 10, 'L': 3, 'XL': 0 },
      views: 1247,
      reviews: [],
      times_ordered: 89,
      popularity: 4.5
    };

    const mockSizes = ['S', 'M', 'L', 'XL'];
    setProduct(mockData);
    setAvailableSizes(mockSizes);
    setStockInfo(mockData.stock);
    setSelectedSize(mockSizes[0]);
    setLoading(false);
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    const availableStock = stockInfo[selectedSize] || 0;
    if (availableStock < quantity) {
      alert(`Only ${availableStock} items available in size ${selectedSize}`);
      return;
    }

    console.log('Added to cart', { 
      productId: product._id, 
      selectedSize, 
      quantity,
      price: product.price 
    });
    alert(`${formatProductName(product.name)} (Size: ${selectedSize}) added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: API call to add/remove from wishlist
  };

  const formatProductName = (name) => {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
      />
    ));
  };

  const getStockStatus = (size) => {
    const stock = stockInfo[size] || 0;
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  };

  const getStockText = (size) => {
    const stock = stockInfo[size] || 0;
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return `Only ${stock} left`;
    return 'In Stock';
  };

  const renderTabContent = () => {
    if (!product) return null;
    
    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-description">
            <h3>Product Details</h3>
            <p>{product.description}</p>
            
            <div className="product-stats">
              <div className="stat-item">
                <span className="stat-label">Views:</span>
                <span className="stat-value">{product.views?.toLocaleString() || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Times Ordered:</span>
                <span className="stat-value">{product.times_ordered?.toLocaleString() || 0}</span>
              </div>
              {product.popularity && (
                <div className="stat-item">
                  <span className="stat-label">Popularity Score:</span>
                  <span className="stat-value">{product.popularity}</span>
                </div>
              )}
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="reviews-section">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviews-grid">
                {product.reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-name">{review.reviewer || 'Anonymous'}</div>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="review-rating">{renderStars(review.rating)}</div>
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        );
      case 'info':
        return (
          <div className="shipping-info">
            <h3>Additional Information</h3>
            <p>{product.description}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  // Handle single image or array of images
  const productImages = Array.isArray(product.productImages) 
    ? product.productImages 
    : [product.productImages];

  return (
    <div className="product-container">
      <Header currentPage="product" cartCount={3} wishlistCount={8} isLoggedIn={true} />

      <div className="main-content">
        <button className="back-button" onClick={() => navigate('/products')}>
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="product-grid">
          <div className="image-section">
            <img 
              src={productImages[selectedImage] || productImages[0]} 
              alt={formatProductName(product.name)} 
              className="main-image" 
            />
            {productImages.length > 1 && (
              <div className="thumbnail-grid">
                {productImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${formatProductName(product.name)} ${i + 1}`}
                    className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-header">
              <div>
                <h1 className="product-title">{formatProductName(product.name)}</h1>
                <div className="product-meta">
                  <span className="product-views">{product.views} views</span>
                  {product.times_ordered > 0 && (
                    <span className="product-orders">{product.times_ordered} orders</span>
                  )}
                </div>
                <div className="rating-section">
                  {product.popularity && (
                    <>
                      <div className="stars">{renderStars(product.popularity)}</div>
                      <span className="rating-text">
                        {product.popularity} ({product.reviews?.length || 0} reviews)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="price-section">
              <span className="current-price">${product.price}</span>
            </div>

            <p className="description">{product.description}</p>

            <div className="variant-section">
              <h3>Size</h3>
              <div className="variant-options">
                {availableSizes.map((size) => {
                  const stockStatus = getStockStatus(size);
                  const isOutOfStock = stockStatus === 'out-of-stock';
                  
                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`variant-btn ${selectedSize === size ? 'active' : ''} ${stockStatus}`}
                      title={getStockText(size)}
                    >
                      {size}
                      {stockStatus === 'low-stock' && <span className="stock-indicator">!</span>}
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                <div className="stock-info">
                  <span className={`stock-status ${getStockStatus(selectedSize)}`}>
                    {getStockText(selectedSize)}
                  </span>
                </div>
              )}
            </div>

            <div className="quantity-section">
              <span>Quantity</span>
              <div className="quantity-control">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => {
                    const maxStock = stockInfo[selectedSize] || 0;
                    setQuantity(Math.min(quantity + 1, maxStock));
                  }}
                  disabled={quantity >= (stockInfo[selectedSize] || 0)}
                >
                  <Plus size={16} />
                </button>
              </div>
              {selectedSize && (
                <span className="max-quantity">
                  Max: {stockInfo[selectedSize] || 0}
                </span>
              )}
            </div>

            <div className="action-buttons">
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={!selectedSize || (stockInfo[selectedSize] || 0) === 0}
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={handleWishlist}
              >
                <Heart size={20} fill={isWishlisted ? '#facc15' : 'transparent'} />
              </button>
              <button className="share-btn">
                <Share size={20} />
              </button>
            </div>

            <div className="features">
              <div><Truck size={16} /> Free Shipping</div>
              <div><RotateCcw size={16} /> 30-Day Returns</div>
              <div><Shield size={16} /> 2-Year Warranty</div>
            </div>
          </div>
        </div>

        <div className="tab-section">
          <div className="tab-buttons">
            {['description', 'reviews', 'info'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'info' ? 'Info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-content">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default ProductDescriptionPage;