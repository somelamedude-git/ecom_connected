import './App.css';
import ProfilePage from './components/ProfilePage';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div className='App'>
     <ProfilePage/>
     <ToastContainer />
    </div>
  );
}

export default App;
