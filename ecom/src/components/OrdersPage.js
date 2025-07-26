import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from './Header';
import '../styles/OrdersPage.css'

function OrdersPage({ loggedin, cartcount, wishlistcount, menumove }) {
  const navigate=useNavigate();
  const [orders, setOrders]=useState([]);
  const [filter, setfilter]=useState('all');
  const [loading, setloading]=useState(true);
  const [error, seterror]=useState('');

  // useEffect(()=> {
  //   fetch() //api ka error handling add
  // }, []);

  const filteredOrders=filter==='all'
    ? orders
    :orders.filter(order=> order.status===filter);

  return (
    <div className="orders-container">
      <Header
        cartcount={cartcount} wishlistcount={wishlistcount}
        loggedin={loggedin}
        menumove={menumove}
      />

      <main className="orders-main">
        <button className="back-btn" onClick={()=> navigate('/')}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div className="orders-hero">
          <h1 className="orders-title">
            Your <span className="orders-highlight">Orders</span>
          </h1>
          <p className="orders-subtitle">
            Track your purchases, and delivery status. Thank you for shopping with us!
          </p>
        </div>

        <div className="orders-filter">
          <button
            className={`filter-btn ${filter==='all' ? 'active' :''}`}
            onClick={()=> setfilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter==='processing' ? 'active' :''}`}
            onClick={()=> setfilter('processing')}
          >
            Processing
          </button>
          <button
            className={`filter-btn ${filter==='shipped' ? 'active' :''}`}
            onClick={()=> setfilter('shipped')}
          >
            Shipped
          </button>
          <button
            className={`filter-btn ${filter==='delivered' ? 'active' :''}`}
            onClick={()=> setfilter('delivered')}
          >
            Delivered
          </button>
        </div>

        {loading && <p className="orders-status-msg">Loading orders...</p>}
        {error && <p className="orders-error-msg">{error}</p>}
        {!loading && !error && filteredOrders.length===0 && (
          <p className="orders-status-msg">No orders found.</p>
        )}

        <div className="orders-list">
          {filteredOrders.map((order)=> (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <p className="order-id">Order #{order.id}</p>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Items:</strong> {order.items.length}</p>
                <p><strong>Total:</strong> ₹{order.total}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default OrdersPage;
