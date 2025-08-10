import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Login from './pages/loginPage';
import RegistrationPage from './pages/registrationPage';
import CartPage from './components/CartPage';
import ProductsPage from './components/ProductPage';
import ProfilePage from './components/ProfilePage';
import AboutPage from './components/AboutUs';
import Layout from './components/Layout';
import WishlistPage from './components/WishlistPage';
import SellerProductsPage from './components/productList';
import SellerOrdersPage from './components/sellerOrders';
import SalesHeatmap from './components/HeatMap';
import AddProductForm from './components/AddProduct';
import SellerProfile from './components/sellerProfile';
import Loading from './components/loading';
import ProductDescriptionPage from './components/SingleProduct';
import ProductAnalytics from './components/productAnalytics';


function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    if (timerId) clearTimeout(timerId); //new thing here see if it works please?
    setShowLoader(false);

    const id = setTimeout(() => {
      setShowLoader(true);
    }, 500);//zyada delay hua

    setTimerId(id);
    return () => {
      clearTimeout(id); // stop timer when navigation completes
    };
  }, [location]);
  // fade out starts
  useEffect(() => {
    if (showLoader) {
      const hideTimer = setTimeout(() => {
        setShowLoader(false);
      }, 800); // Fade out duration + small buffer
      return () => clearTimeout(hideTimer);
    }
  }, [location.key]);
  return (
    <>
      <Loading isVisible={showLoader} />
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
          path="profile"
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

        <Route path='/product/:product_id' element={
          <Layout>
            <ProductDescriptionPage/>
          </Layout>
        }></Route>

        <Route path='/seller/analysis/product/:product_id' element={
          <Layout>
            <ProductAnalytics/>
          </Layout>
        }></Route>
      </Routes>
    </>
  );
}

export default App;
