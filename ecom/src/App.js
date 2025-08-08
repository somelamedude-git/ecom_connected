import './App.css';
// import ProductDescriptionPage from './components/SingleProduct';
import LandingPage from './components/LandingPage';
import Login from './pages/loginPage';
import RegistrationPage from './pages/registrationPage';
import { Routes, Route } from 'react-router-dom';
import CartPage from './components/CartPage';
// import { ToastContainer } from 'react-toastify';
import ProductsPage from './components/ProductPage';
import ProfilePage from './components/ProfilePage';
import AboutPage from './components/AboutUs';
import Layout from './components/Layout';
import WishlistPage from './components/WishlistPage';
import SellerProductsPage from './components/productList';
import SellerOrdersPage from './components/sellerOrders';
import SalesHeatmap from './components/HeatMap';
import AddProductForm from './components/AddProduct';
import SellerProfile from './components/sellerProfile';''
import Loading from './components/loading';
import { useState, useEffect } from 'react';

function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timerStart, timerHide;

    // Delay 
    timerStart = setTimeout(() => {
      setShowLoader(true);
      setTimeout(() => setVisible(true), 50); //added fade in
    }, 500);

    return () => {
      clearTimeout(timerStart);
      setVisible(false);
      timerHide = setTimeout(() => setShowLoader(false), 300); // matches fade-out duration
    };
  }, [location]);

  return (
    <>
      {showLoader && (
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <Loading />
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <ProductsPage />
            </Layout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <Layout>
              <WishlistPage />
            </Layout>
          }
        />
        <Route
          path="/seller/products"
          element={
            <Layout>
              <SellerProductsPage />
            </Layout>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <Layout>
              <SellerOrdersPage />
            </Layout>
          }
        />
        <Route
          path="/seller/analytics"
          element={
            <Layout>
              <SalesHeatmap />
            </Layout>
          }
        />
        <Route
          path="/seller/add-product"
          element={
            <Layout>
              <AddProductForm />
            </Layout>
          }
        />
        <Route
          path="/seller/profile"
          element={
            <Layout>
              <SellerProfile />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;

