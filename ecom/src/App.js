import './App.css';
import ProductDescriptionPage from './components/SingleProduct';
import LandingPage from './components/LandingPage';
import Login from './pages/loginPage';
import RegistrationPage from './pages/registrationPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './components/CartPage';
import { ToastContainer } from 'react-toastify';
import ProductsPage from './components/ProductPage';
import ProfilePage from './components/ProfilePage';
import AboutPage from './components/AboutUs';
import Layout from './components/Layout';
import WishlistPage from './components/WishlistPage';
import SellerProductsPage from './components/productList';
import SellerOrdersPage from './components/sellerOrders';
import SalesHeatmap from './components/HeatMap';
import AddProductForm from './components/AddProduct';

function App() {
  return (
    
      <Routes>
        <Route path='/' element={
          <Layout>
            <LandingPage/>
          </Layout>
        }></Route>
        <Route path = '/login' element={<Login/>}></Route>
        <Route path='/signup' element={<RegistrationPage/>}></Route>
        <Route path='profile' element={<Layout><ProfilePage/></Layout>}></Route>
        <Route path='/cart' element={
          <Layout>
            <CartPage/>
          </Layout>
        }></Route>
        <Route path='/about' element={
          <Layout>
            <AboutPage/>
          </Layout>
        }></Route>
        <Route path='/products' element=
        {
          <Layout>
            <ProductsPage/>
          </Layout>
        }></Route>
        <Route
        path='/wishlist'
        element={
          <Layout>
            <WishlistPage/>
          </Layout>
        }
        ></Route>
        <Route path='/seller/products'
        element={
          <Layout>
            <SellerProductsPage/>
          </Layout>
        }
        >
        </Route>

        <Route path='/seller/orders' element={
          <Layout>
            <SellerOrdersPage/>
          </Layout>
        }></Route>

        <Route path='/seller/analytics' element={
          <Layout>
            <SalesHeatmap/>
          </Layout>
        }></Route>

        <Route path='/seller/add-product' element={
          <Layout>
            <AddProductForm/>
          </Layout>
        }></Route>
      </Routes>
    
  );
}

export default App;
