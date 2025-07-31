import './App.css';
import ProductDescriptionPage from './components/SingleProduct';
import LandingPage from './components/LandingPage';
import Login from './pages/loginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path = '/login' element={<Login/>}></Route>
      </Routes>
    
  );
}

export default App;
