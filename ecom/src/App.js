
import './App.css';
import LoginPage from './components/login';
import axios from 'axios';

const onLogin = async(formData)=>{
  try{
    const res = await axios.post('http://localhost:3000/user/login', formData);
    console.log(res.data);
  }
  catch(err){
    console.log(err);
  }
}

function App() {
  return (
    <div className="App">
     <LoginPage onLogin={onLogin}/>
    </div>
  );
}

export default App;
