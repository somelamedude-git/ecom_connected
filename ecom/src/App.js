import './App.css';
import ProductDescriptionPage from './components/SingleProduct';
import LandingPage from './components/LandingPage';
import Login from './pages/loginPage';
import RegistrationPage from './pages/registrationPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProfilePage from './components/ProfilePage';


function App() {
  return (
    
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path = '/login' element={<Login/>}></Route>
        <Route path='/signup' element={<RegistrationPage/>}></Route>
        <Route path='/profile' element={<ProfilePage/>}></Route>
      </Routes>
    
  );
}

export default App;
