import './App.css';
import ProductDescriptionPage from './components/SingleProduct';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div className='App'>
     <ProductDescriptionPage/>
     {/* <ToastContainer /> */}
    </div>
  );
}

export default App;
