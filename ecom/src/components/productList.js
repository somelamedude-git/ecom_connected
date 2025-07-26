import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Eye, Star, ShoppingCart, TrendingUp, Filter, Search, Grid, List } from 'lucide-react';
import axios from 'axios';

const SellerProductsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const mockProducts = [
    {
      _id: '1',
      name: 'wireless bluetooth headphones',
      description: 'Premium noise-canceling wireless headphones with 30-hour battery life and crystal-clear audio quality.',
      price: 199.99,
      productImages: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      views: 1247,
      reviews: 4.5,
      popularity: 87,
      stock: new Map([['black', 15], ['white', 8], ['blue', 12]]),
      times_ordered: 324,
      added_to_cart: 89,
      times_returned: 12,
      category: { name: 'Electronics' },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: 'organic cotton t-shirt',
      description: 'Sustainable and comfortable organic cotton t-shirt, perfect for everyday wear with a relaxed fit.',
      price: 29.99,
      productImages: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
      views: 892,
      reviews: 4.2,
      popularity: 64,
      stock: new Map([['small', 20], ['medium', 25], ['large', 18], ['xl', 10]]),
      times_ordered: 156,
      added_to_cart: 45,
      times_returned: 8,
      category: { name: 'Clothing' },
      createdAt: '2024-02-03T14:20:00Z'
    },
    {
      _id: '3',
      name: 'smart fitness watch',
      description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and 7-day battery life.',
      price: 299.99,
      productImages: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      views: 2103,
      reviews: 4.7,
      popularity: 93,
      stock: new Map([['black', 12], ['silver', 7], ['rose-gold', 5]]),
      times_ordered: 287,
      added_to_cart: 76,
      times_returned: 15,
      category: { name: 'Electronics' },
      createdAt: '2024-01-28T09:15:00Z'
    },
    {
      _id: '4',
      name: 'ceramic coffee mug set',
      description: 'Handcrafted ceramic coffee mugs set of 4, perfect for your morning brew with elegant design.',
      price: 49.99,
      productImages: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop',
      views: 567,
      reviews: 4.0,
      popularity: 45,
      stock: new Map([['white', 30], ['blue', 15], ['green', 20]]),
      times_ordered: 89,
      added_to_cart: 23,
      times_returned: 3,
      category: { name: 'Home & Garden' },
      createdAt: '2024-02-10T16:45:00Z'
    },
    {
      _id: '5',
      name: 'leather laptop bag',
      description: 'Professional leather laptop bag with multiple compartments, perfect for business and travel.',
      price: 159.99,
      productImages: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      views: 1456,
      reviews: 4.6,
      popularity: 78,
      stock: new Map([['brown', 8], ['black', 12], ['tan', 6]]),
      times_ordered: 201,
      added_to_cart: 54,
      times_returned: 7,
      category: { name: 'Accessories' },
      createdAt: '2024-01-20T11:30:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true);
      try {
        
        const res = await fetch(`seller/productList?page=${currentPage}&limit=${limit}`);
        
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let filteredProducts = [...mockProducts];

        if (searchTerm) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (filterBy !== 'all') {
          filteredProducts = filteredProducts.filter(product =>
            product.category.name.toLowerCase() === filterBy.toLowerCase()
          );
        }
        
        switch (sortBy) {
          case 'newest':
            filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            filteredProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'popular':
            filteredProducts.sort((a, b) => b.popularity - a.popularity);
            break;
          case 'views':
            filteredProducts.sort((a, b) => b.views - a.views);
            break;
        }
        
        setTotalPages(Math.ceil(filteredProducts.length / limit));
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        setProducts(filteredProducts.slice(startIndex, endIndex));
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, limit, sortBy, filterBy, searchTerm]);

  const getStockTotal = (stockMap) => {
    if (!stockMap || !(stockMap instanceof Map)) return 0;
    return Array.from(stockMap.values()).reduce((total, count) => total + count, 0);
  };

  const getStockStatus = (stockMap) => {
    const total = getStockTotal(stockMap);
    if (total === 0) return { status: 'out-of-stock', text: 'Out of Stock' };
    if (total < 10) return { status: 'low-stock', text: 'Low Stock' };
    return { status: 'in-stock', text: 'In Stock' };
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
      />
    ));
  };

  const ProductCard = ({ product }) => {
    const stockInfo = getStockStatus(product.stock);
    
    return (
      <div className="product-card">
        <div className="product-image-container">
          <img src={product.productImages} alt={product.name} className="product-image" />
          <div className="product-overlay">
            <div className="overlay-stats">
              <div className="stat-item">
                <Eye size={16} />
                <span>{product.views}</span>
              </div>
              <div className="stat-item">
                <ShoppingCart size={16} />
                <span>{product.added_to_cart}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name">{product.name}</h3>
            <div className="product-category">{product.category.name}</div>
          </div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-stats">
            <div className="stat-row">
              <div className="rating">
                {renderStars(product.reviews)}
                <span className="rating-value">({product.reviews})</span>
              </div>
              <div className="popularity">
                <TrendingUp size={14} />
                <span>{product.popularity}%</span>
              </div>
            </div>
            
            <div className="stat-row">
              <div className="orders-count">
                <Package size={14} />
                <span>{product.times_ordered} orders</span>
              </div>
              <div className={`stock-status ${stockInfo.status}`}>
                {stockInfo.text} ({getStockTotal(product.stock)})
              </div>
            </div>
          </div>
          
          <div className="product-footer">
            <div className="product-price">${product.price}</div>
            <div className="product-actions">
              <button className="btn-secondary">Edit</button>
              <button className="btn-primary">View Details</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProductListItem = ({ product }) => {
    const stockInfo = getStockStatus(product.stock);
    
    return (
      <div className="product-list-item">
        <img src={product.productImages} alt={product.name} className="list-product-image" />
        
        <div className="list-product-info">
          <div className="list-product-main">
            <h3 className="list-product-name">{product.name}</h3>
            <div className="list-product-category">{product.category.name}</div>
            <p className="list-product-description">{product.description}</p>
          </div>
          
          <div className="list-product-stats">
            <div className="list-stat-item">
              <Eye size={16} />
              <span>{product.views} views</span>
            </div>
            <div className="list-stat-item">
              <ShoppingCart size={16} />
              <span>{product.added_to_cart} carts</span>
            </div>
            <div className="list-stat-item">
              <Package size={16} />
              <span>{product.times_ordered} orders</span>
            </div>
            <div className="rating">
              {renderStars(product.reviews)}
              <span className="rating-value">({product.reviews})</span>
            </div>
          </div>
        </div>
        
        <div className="list-product-right">
          <div className="list-product-price">${product.price}</div>
          <div className={`stock-status ${stockInfo.status}`}>
            {stockInfo.text} ({getStockTotal(product.stock)})
          </div>
          <div className="list-product-actions">
            <button className="btn-secondary">Edit</button>
            <button className="btn-primary">View</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="products-container">
      <div className="products-main">
        <button className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="products-hero">
          <h1 className="products-title">
            My <span className="products-highlight">Products</span>
          </h1>
          <p className="products-subtitle">
            Manage your product inventory, view performance metrics, and track sales analytics all in one place.
          </p>
        </div>

        <div className="products-controls">
          <div className="search-filter-row">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="filter-sort-row">
            <div className="products-filter">
              <Filter size={16} />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home & garden">Home & Garden</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="products-sort">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="popular">Most Popular</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>

            <div className="limit-selector">
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="limit-select"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="products-status-msg">
            <div className="loading-spinner"></div>
            Loading your products...
          </div>
        )}

        {error && (
          <div className="products-error-msg">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="products-status-msg">
            No products found. Try adjusting your search or filters.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className={`products-list ${viewMode}`}>
              {viewMode === 'grid' 
                ? products.map(product => <ProductCard key={product._id} product={product} />)
                : products.map(product => <ProductListItem key={product._id} product={product} />)
              }
            </div>

            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .products-container {
          min-height: 100vh;
          background-color: #000;
          color: #fff;
        }

        .products-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 16px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9ca3af;
          background: none;
          border: none;
          font-size: 16px;
          margin-bottom: 32px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .back-btn:hover {
          color: #facc15;
        }

        .products-hero {
          text-align: center;
          margin-bottom: 48px;
        }

        .products-title {
          font-size: 64px;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .products-highlight {
          background: linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .products-subtitle {
          color: #9ca3af;
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .products-controls {
          margin-bottom: 32px;
        }

        .search-filter-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 16px;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 12px 12px 12px 44px;
          color: #fff;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #facc15;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
        }

        .toggle-btn {
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 6px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #9ca3af;
        }

        .toggle-btn:hover {
          border-color: #facc15;
          color: #facc15;
        }

        .toggle-btn.active {
          background: linear-gradient(135deg, hsl(45, 100%, 85%), hsl(35, 90%, 68%));
          color: #000;
          border-color: transparent;
        }

        .filter-sort-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .products-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9ca3af;
        }

        .filter-select,
        .sort-select,
        .limit-select {
          background-color: #1f2937;
          color: #fff;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .filter-select:focus,
        .sort-select:focus,
        .limit-select:focus {
          outline: none;
          border-color: #facc15;
        }

        .products-status-msg,
        .products-error-msg {
          text-align: center;
          margin-top: 64px;
          font-size: 16px;
          color: #9ca3af;
        }

        .products-error-msg {
          color: #f87171;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #374151;
          border-top: 3px solid #facc15;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .products-list.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }

        .products-list.list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 32px;
        }

        .product-card {
          background-color: #111827;
          border-radius: 12px;
          border: 1px solid #374151;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          border-color: #facc15;
          transform: translateY(-4px);
        }

        .product-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .overlay-stats {
          display: flex;
          gap: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-size: 14px;
        }

        .product-info {
          padding: 20px;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          text-transform: capitalize;
        }

        .product-category {
          background-color: #374151;
          color: #9ca3af;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .product-description {
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-stats {
          margin-bottom: 16px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating-value {
          color: #9ca3af;
          font-size: 12px;
          margin-left: 4px;
        }

        .popularity {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #10b981;
          font-size: 12px;
        }

        .orders-count {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #9ca3af;
          font-size: 12px;
        }

        .stock-status {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .stock-status.in-stock {
          background-color: #10b981;
          color: #fff;
        }

        .stock-status.low-stock {
          background-color: #facc15;
          color: #000;
        }

        .stock-status.out-of-stock {
          background-color: #f87171;
          color: #fff;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 20px;
          font-weight: 600;
          color: #facc15;
        }

        .product-actions {
          display: flex;
          gap: 8px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, hsl(45, 100%, 85%), hsl(35, 90%, 68%));
          color: #000;
        }

        .btn-secondary {
          background-color: transparent;
          color: #9ca3af;
          border: 1px solid #374151;
        }

        .btn-primary:hover,
        .btn-secondary:hover {
          transform: translateY(-1px);
        }

        .btn-secondary:hover {
          border-color: #facc15;
          color: #facc15;
        }

        .product-list-item {
          background-color: #111827;
          border-radius: 12px;
          border: 1px solid #374151;
          padding: 16px;
          display: flex;
          gap: 16px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .product-list-item:hover {
          border-color: #facc15;
        }

        .list-product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .list-product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .list-product-main {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .list-product-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          text-transform: capitalize;
        }

        .list-product-category {
          background-color: #374151;
          color: #9ca3af;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          text-transform: uppercase;
          width: fit-content;
        }

        .list-product-description {
          color: #9ca3af;
          font-size: 12px;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .list-product-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .list-stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #9ca3af;
          font-size: 12px;
        }

        .list-product-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          text-align: right;
        }

        .list-product-price {
          font-size: 18px;
          font-weight: 600;
          color: #facc15;
        }

        .list-product-actions {
          display: flex;
          gap: 8px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 48px;
        }

        .pagination-btn {
          background-color: #1f2937;
          color: #fff;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #facc15;
          background-color: #374151;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #9ca3af;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .products-title {
            font-size: 48px;
          }

          .search-filter-row {
            flex-direction: column;
            gap: 12px;
          }

          .search-container {
            max-width: 100%;
          }

          .filter-sort-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .products-list.grid {
            grid-template-columns: 1fr;
          }

          .product-list-item {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .list-product-image {
            width: 100%;
            height: 160px;
          }

          .list-product-right {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .list-product-stats {
            justify-content: space-between;
            width: 100%;
          }

          .pagination {
            flex-direction: column;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .products-title {
            font-size: 36px;
          }

          .products-main {
            padding: 16px 12px;
          }

          .product-card {
            margin: 0 -4px;
          }

          .product-info {
            padding: 16px;
          }

          .product-header {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }

          .product-footer {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .product-actions {
            justify-content: space-between;
          }

          .btn-primary,
          .btn-secondary {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SellerProductsDashboard;