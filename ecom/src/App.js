import './App.css';
import SellerProductsDashboard from './components/productList';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div className='App'>
     <SellerProductsDashboard/>
     {/* <ToastContainer /> */}
    </div>
  );
}

export default App;
