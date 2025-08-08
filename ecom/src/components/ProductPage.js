import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Grid, List, Star, Heart, ShoppingCart, Eye, TrendingUp, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [wishlist, setWishlist] = useState(new Set());
  const [cartLoading, setCartLoading] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(new Set());
  
  // Size selection popup states
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  // Get user token from localStorage or context
  const getUserToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const fetchProducts = async (page = 0, currentSortBy = sortBy, currentLimit = limit) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/product/fetchProducts', {
        params: {
          page: page,
          limit: currentLimit,
          sortBy: currentSortBy
        }
      });

      const data = response.data;

      // Backend returns sortedProducts - use them directly without re-sorting
      setProducts(data.sortedProducts || []);
      setTotalCount(data.totalCount);
      setTotalPages(data.num_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
      setCurrentPage(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's wishlist on component mount
  const fetchWishlist = async () => {
    const token = getUserToken();
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:3000/wishlist/getItems', {
        withCredentials: true
      });
      
      if (response.data.success) {
        const wishlistIds = new Set(response.data.wishlist.map(item => item.product._id || item.product));
        setWishlist(wishlistIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Open size selection popup
  const openSizeSelection = (product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setShowSizePopup(true);
  };

  // Close size selection popup
  const closeSizeSelection = () => {
    setShowSizePopup(false);
    setSelectedProduct(null);
    setSelectedSize('');
  };

  // Add to cart function with size
  const addToCart = async (productId, size) => {

    if (!size) {
      alert('Please select a size');
      return;
    }

    setCartLoading(prev => new Set(prev).add(productId));
    
    try {
      const response = await axios.post(`http://localhost:3000/cart/addItem/${productId}`, {
        size_: size
      });

      if (response.data.success) {
        alert('Product added to cart successfully!');
        closeSizeSelection(); 
      } else {
        alert(response.data.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        alert('Please login to add items to cart');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to add product to cart. Please try again.');
      }
    } finally {
      setCartLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle add to cart with size selection
  const handleAddToCart = (product) => {
    if (product.stock && Object.keys(product.stock).length > 0) {
      // Product has sizes, show size selection popup
      openSizeSelection(product);
    } else {
      // Product has no sizes, add directly
      addToCart(product._id, null);
    }
  };

  // Toggle wishlist function
  const toggleWishlist = async (productId) => {
    const token = getUserToken();
    if (!token) {
      alert('Please login to add items to wishlist');
      return;
    }

    const isInWishlist = wishlist.has(productId);
    setWishlistLoading(prev => new Set(prev).add(productId));

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await axios.delete(`http://localhost:3000/wishlist/remove/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setWishlist(prev => {
            const newWishlist = new Set(prev);
            newWishlist.delete(productId);
            return newWishlist;
          });
        } else {
          alert(response.data.message || 'Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await axios.post('http://localhost:3000/wishlist/add', {
          productId: productId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setWishlist(prev => new Set(prev).add(productId));
        } else {
          alert(response.data.message || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      if (error.response?.status === 401) {
        alert('Please login to manage your wishlist');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to update wishlist. Please try again.');
      }
    } finally {
      setWishlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, sortBy, limit);
    fetchWishlist();
  }, [currentPage, limit, sortBy]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => {
        const searchLower = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.name.toLowerCase().includes(searchLower)
        );
      });
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const handlePageChange = (newPage) => {
    if (searchQuery) {
      // For search results, handle pagination client-side
      setCurrentPage(newPage);
    } else {
      // For regular results, let backend handle pagination
      if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(0); // Reset to first page when sorting changes
  };

  // Calculate pagination for search results (client-side)
  const searchTotalPages = Math.ceil(filteredProducts.length / limit);
  
  // Get current page results for display
  const getCurrentProducts = () => {
    if (searchQuery) {
      // For search results, handle pagination client-side
      const startIndex = currentPage * limit;
      const endIndex = startIndex + limit;
      return filteredProducts.slice(startIndex, endIndex);
    } else {
      // For regular results, backend already handles pagination
      return products;
    }
  };

  const currentProducts = getCurrentProducts();

  // Get correct pagination values
  const getDisplayTotalPages = () => searchQuery ? searchTotalPages : totalPages;
  const getDisplayTotalCount = () => searchQuery ? filteredProducts.length : totalCount;

  // Size Selection Popup Component
  const SizeSelectionPopup = () => {
    if (!showSizePopup || !selectedProduct) return null;

    const availableSizes = selectedProduct.stock ? Object.keys(selectedProduct.stock).filter(size => selectedProduct.stock[size] > 0) : [];
    const isAddingToCart = cartLoading.has(selectedProduct._id);

    return (
      <div className="size-popup-overlay" onClick={closeSizeSelection}>
        <div className="size-popup" onClick={(e) => e.stopPropagation()}>
          <div className="size-popup-header">
            <h3>Select Size</h3>
            <button className="close-btn" onClick={closeSizeSelection}>
              <X size={20} />
            </button>
          </div>
          
          <div className="size-popup-content">
            <div className="product-info-mini">
              <img src={selectedProduct.productImages} alt={selectedProduct.name} className="product-mini-image" />
              <div>
                <h4>{selectedProduct.name}</h4>
                <p className="product-price">${selectedProduct.price}</p>
              </div>
            </div>

            <div className="size-options">
              <h5>Available Sizes:</h5>
              <div className="size-grid">
                {availableSizes.length > 0 ? (
                  availableSizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.toUpperCase()}
                      <span className="stock-count">({selectedProduct.stock[size]} left)</span>
                    </button>
                  ))
                ) : (
                  <p className="no-sizes">No sizes available</p>
                )}
              </div>
            </div>
          </div>

          <div className="size-popup-footer">
            <button className="cancel-btn" onClick={closeSizeSelection}>
              Cancel
            </button>
            <button 
              className={`confirm-add-btn ${isAddingToCart ? 'loading' : ''}`}
              onClick={() => addToCart(selectedProduct._id, selectedSize)}
              disabled={!selectedSize || isAddingToCart || availableSizes.length === 0}
            >
              <ShoppingCart size={16} className={isAddingToCart ? 'spin' : ''} />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const avgRating = calculateAverageRating(product.reviews);
    const stockCount = Object.values(product.stock || {}).reduce((sum, count) => sum + count, 0);
    const isInWishlist = wishlist.has(product._id);
    const isWishlistLoading = wishlistLoading.has(product._id);
    const isCartLoading = cartLoading.has(product._id);
    
    return (
      <div className={`product-card ${viewMode}`}>
        <div className="product-image-container">
          <img 
            src={product.productImages} 
            alt={product.name}
            className="product-image"
          />
          <div className="product-overlay">
            <button 
              className={`wishlist-btn ${isInWishlist ? 'active' : ''} ${isWishlistLoading ? 'loading' : ''}`}
              onClick={() => toggleWishlist(product._id)}
              disabled={isWishlistLoading}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart 
                size={18} 
                fill={isInWishlist ? '#ef4444' : 'none'} 
                className={isWishlistLoading ? 'spin' : ''}
              />
            </button>
            <button className="quick-view-btn" title="Quick view">
              <Eye size={18} />
            </button>
          </div>
          {product.popularity >= 90 && (
            <div className="popular-badge">
              <TrendingUp size={14} />
              Popular
            </div>
          )}
          {stockCount < 10 && stockCount > 0 && (
            <div className="low-stock-badge">
              Only {stockCount} left
            </div>
          )}
          {stockCount === 0 && (
            <div className="out-of-stock-badge">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-category">{product.category.name}</div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          
          <div className="product-stats">
            <div className="rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(avgRating) ? '#fbbf24' : 'none'}
                    color={i < Math.floor(avgRating) ? '#fbbf24' : '#6b7280'}
                  />
                ))}
              </div>
              <span className="rating-text">({product.reviews.length})</span>
            </div>
            <div className="views">
              <Eye size={14} />
              {product.views}
            </div>
          </div>
          
          <div className="product-footer">
            <div className="price-section">
              <span className="price">${product.price}</span>
              <span className="orders">{product.times_ordered} sold</span>
            </div>
            <button 
              className={`add-to-cart-btn ${isCartLoading ? 'loading' : ''}`}
              disabled={stockCount === 0 || isCartLoading}
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart size={16} className={isCartLoading ? 'spin' : ''} />
              {isCartLoading ? 'Adding...' : stockCount === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="products-main">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-main">
        {/* Header */}
        <button className="backb" onClick={()=>navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="products-header">
          <h1>All Products</h1>
          <p className="products-subtitle">Discover our curated collection of premium products</p>
        </div>

        {/* Search and Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="controls-right">
            <div className="limit-dropdown">
              <span>Show:</span>
              <select value={limit} onChange={(e) => handleLimitChange(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="sort-dropdown">
              <SlidersHorizontal size={18} />
              <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="views">Most Viewed</option>
              </select>
              <ChevronDown size={16} />
            </div>
            
            <button 
              className={`filters-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </button>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <span>
            Showing {currentProducts.length} of {getDisplayTotalCount()} products
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          <span className="page-info">
            Page {currentPage + 1} of {getDisplayTotalPages()}
          </span>
        </div>

        {/* Search Results Summary */}
        {searchQuery && (
          <div className="search-summary">
            {filteredProducts.length === 0 ? (
              <span className="no-results">No products found matching your search.</span>
            ) : (
              <span className="search-results">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {currentProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">
              <Search size={48} />
            </div>
            <h3>No products found</h3>
            <p>
              {searchQuery 
                ? `No products match "${searchQuery}". Try different keywords or clear your search.`
                : 'Try adjusting your search or filters'
              }
            </p>
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={`products-grid ${viewMode}`}>
            {currentProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {getDisplayTotalPages() > 1 && (
          <div className="pagination">
            <button 
              className="page-btn"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            
            <div className="page-numbers">
              {[...Array(getDisplayTotalPages())].map((_, i) => {
                const maxPages = getDisplayTotalPages();
                // Show first page, last page, current page, and pages around current
                const showPage = i === 0 || 
                                i === maxPages - 1 || 
                                Math.abs(i - currentPage) <= 2;
                
                if (!showPage && i === 1 && currentPage > 3) {
                  return <span key="start-ellipsis" className="ellipsis">...</span>;
                }
                if (!showPage && i === maxPages - 2 && currentPage < maxPages - 4) {
                  return <span key="end-ellipsis" className="ellipsis">...</span>;
                }
                if (!showPage) return null;

                return (
                  <button
                    key={i}
                    className={`page-number ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            
            <button 
              className="page-btn"
              disabled={currentPage === getDisplayTotalPages() - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* Size Selection Popup */}
      <SizeSelectionPopup />

      <style jsx>{`
        .products-container {
          min-height: 100vh;
          background-color: #000;
          color: #fff;
        }

        .products-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .backb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          background: none;
          border: none;
          font-size: 1rem;
          margin-bottom: 2rem;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0.5rem 0;
        }

        .backb:hover {
          color: #fff;
        }

        .loading {
          text-align: center;
          font-size: 1.125rem;
          color: #9ca3af;
          padding: 4rem 0;
        }

        .products-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .products-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .products-subtitle {
          font-size: 1.125rem;
          color: #9ca3af;
          margin: 0;
        }

        .controls-section {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #111827;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          flex: 1;
          min-width: 300px;
          transition: border-color 0.2s ease;
        }

        .search-bar:focus-within {
          border-color: #fbbf24;
        }

        .search-bar svg {
          color: #9ca3af;
        }

        .search-bar input {
          background: none;
          border: none;
          color: #fff;
          font-size: 1rem;
          flex: 1;
          outline: none;
        }

        .search-bar input::placeholder {
          color: #6b7280;
        }

        .clear-search {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: #374151;
          color: #fff;
        }

        .controls-right {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .limit-dropdown {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #111827;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
        }

        .limit-dropdown span {
          color: #9ca3af;
        }

        .limit-dropdown select {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          outline: none;
          appearance: none;
        }

        .sort-dropdown {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #111827;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
        }

        .sort-dropdown svg:first-child {
          color: #9ca3af;
        }

        .sort-dropdown select {
          background: none;
          border: none;
          color: #fff;
          font-size: 0.875rem;
          cursor: pointer;
          outline: none;
          appearance: none;
        }

        .sort-dropdown svg:last-child {
          color: #6b7280;
          pointer-events: none;
        }

        .filters-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #111827;
          border: 1px solid #374151;
          color: #9ca3af;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .filters-btn:hover,
        .filters-btn.active {
          background: #1f2937;
          color: #fff;
          border-color: #6b7280;
        }

        .view-toggle {
          display: flex;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .view-btn {
          background: #111827;
          border: none;
          color: #9ca3af;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn:hover {
          background: #1f2937;
          color: #fff;
        }

        .view-btn.active {
          background: #fbbf24;
          color: #000;
        }

        .results-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #9ca3af;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .page-info {
          color: #6b7280;
        }

        .search-summary {
          background: #111827;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .search-results {
          color: #fbbf24;
        }

        .no-results {
          color: #ef4444;
        }

        .no-products {
          text-align: center;
          padding: 4rem 2rem;
          color: #9ca3af;
        }

        .no-products-icon {
          margin: 0 auto 1.5rem;
          opacity: 0.6;
        }

        .no-products h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .no-products p {
          font-size: 1rem;
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }

        .clear-search-btn {
          background: #fbbf24;
          color: #000;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-search-btn:hover {
          background: #f59e0b;
          transform: translateY(-1px);
        }

        .products-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .products-grid.grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        .products-grid.list {
          grid-template-columns: 1fr;
        }

        .product-card {
          background: #111827;
          border: 1px solid #374151;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .product-card:hover {
          border-color: #6b7280;
          transform: translateY(-2px);
        }

        .product-card.list {
          display: flex;
          align-items: start;
        }

        .product-card.list .product-image-container {
          width: 200px;
          flex-shrink: 0;
        }

        .product-card.list .product-info {
          padding: 1.5rem;
          flex: 1;
        }

        .product-image-container {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
        }

        .product-card.list .product-image-container {
          aspect-ratio: 1;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-overlay {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .wishlist-btn,
        .quick-view-btn {
          background: rgba(0, 0, 0, 0.8);
          border: none;
          color: #fff;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wishlist-btn:hover,
        .quick-view-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .wishlist-btn.active {
          color: #ef4444;
        }

        .wishlist-btn:disabled,
        .add-to-cart-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wishlist-btn.loading,
        .add-to-cart-btn.loading {
          opacity: 0.8;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .popular-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .low-stock-badge {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          background: #f59e0b;
          color: #fff;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .out-of-stock-badge {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          background: #ef4444;
          color: #fff;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .product-info {
          padding: 1.25rem;
        }

        .product-category {
          color: #fbbf24;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #fff;
          text-transform: capitalize;
          line-height: 1.3;
        }

        .product-description {
          color: #9ca3af;
          font-size: 0.875rem;
          line-height: 1.4;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-card.list .product-description {
          -webkit-line-clamp: 3;
        }

        .product-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stars {
          display: flex;
          gap: 0.125rem;
        }

        .rating-text {
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .views {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .price-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fbbf24;
        }

        .orders {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          min-width: 120px;
          justify-content: center;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        }

        .add-to-cart-btn:disabled {
          background: #374151;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .add-to-cart-btn.loading {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          opacity: 0.8;
        }

        /* Size Selection Popup Styles */
        .size-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .size-popup {
          background: #111827;
          border: 1px solid #374151;
          border-radius: 1rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .size-popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #374151;
        }

        .size-popup-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          color: #fff;
          background: #374151;
        }

        .size-popup-content {
          padding: 1.5rem;
        }

        .product-info-mini {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #1f2937;
          border-radius: 0.5rem;
        }

        .product-mini-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        .product-info-mini h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 0.25rem;
        }

        .product-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #fbbf24;
          margin: 0;
        }

        .size-options h5 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #9ca3af;
          margin: 0 0 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .size-option {
          background: #1f2937;
          border: 2px solid #374151;
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          font-weight: 600;
        }

        .size-option:hover {
          border-color: #6b7280;
          background: #374151;
        }

        .size-option.selected {
          border-color: #fbbf24;
          background: rgba(251, 191, 36, 0.1);
          color: #fbbf24;
        }

        .stock-count {
          display: block;
          font-size: 0.75rem;
          font-weight: 400;
          color: #9ca3af;
          margin-top: 0.25rem;
        }

        .size-option.selected .stock-count {
          color: #fbbf24;
        }

        .no-sizes {
          text-align: center;
          color: #ef4444;
          font-size: 0.875rem;
          padding: 2rem;
          background: #1f2937;
          border-radius: 0.5rem;
        }

        .size-popup-footer {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid #374151;
        }

        .cancel-btn {
          flex: 1;
          background: #374151;
          border: none;
          color: #9ca3af;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #4b5563;
          color: #fff;
        }

        .confirm-add-btn {
          flex: 2;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .confirm-add-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        }

        .confirm-add-btn:disabled {
          background: #374151;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .confirm-add-btn.loading {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          opacity: 0.8;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .page-btn {
          background: #111827;
          border: 1px solid #374151;
          color: #9ca3af;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .page-btn:hover:not(:disabled) {
          background: #1f2937;
          color: #fff;
          border-color: #6b7280;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .page-number {
          background: #111827;
          border: 1px solid #374151;
          color: #9ca3af;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          min-width: 44px;
        }

        .page-number:hover {
          background: #1f2937;
          color: #fff;
          border-color: #6b7280;
        }

        .page-number.active {
          background: #fbbf24;
          color: #000;
          border-color: #fbbf24;
        }

        .ellipsis {
          color: #6b7280;
          padding: 0.75rem 0.5rem;
          font-size: 0.875rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .products-grid.grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .products-main {
            padding: 1.5rem 1rem;
          }

          .products-header h1 {
            font-size: 2.5rem;
          }

          .controls-section {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .controls-right {
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .search-bar {
            min-width: auto;
          }

          .products-grid.grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }

          .product-card.list {
            flex-direction: column;
          }

          .product-card.list .product-image-container {
            width: 100%;
            aspect-ratio: 1.5;
          }

          .results-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .pagination {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .page-numbers {
            order: -1;
            width: 100%;
            justify-content: center;
          }

          .size-popup {
            margin: 1rem;
            max-width: none;
          }

          .size-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 0.5rem;
          }

          .size-popup-footer {
            flex-direction: column;
          }

          .product-info-mini {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .products-main {
            padding: 1rem;
          }

          .products-header h1 {
            font-size: 2rem;
          }

          .controls-right {
            flex-direction: column;
            align-items: stretch;
          }

          .view-toggle {
            align-self: center;
          }

          .products-grid.grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 1rem;
          }

          .product-info {
            padding: 1rem;
          }

          .product-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .add-to-cart-btn {
            justify-content: center;
          }

          .limit-dropdown,
          .sort-dropdown {
            justify-content: space-between;
          }

          .size-popup-overlay {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;