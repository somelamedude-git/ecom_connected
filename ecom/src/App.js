
import './App.css';
import SignupPage from './components/SignUp';
import axios from 'axios';

const required_api_data = (formData)=>{
  if(formData.password !== formData.confirmPassword){
    throw new Error("Passwords do not match");
  }

  return {
    name: formData.firstName + " " + formData.lastName,
    email: formData.email,
    password: formData.password,
    kind: formData.kind,
    age: Number(formData.age),
    username: formData.username
  }
}

const onSignUp = async(formData)=>{
  try {
    const Api_data = required_api_data(formData);
    const res = await axios.post('http://localhost:3000/user/register', Api_data);
    console.log(res.data);
  } catch(err) {
    console.log(err);
  }
}


function App() {
  return (
    <div className="App">
    <SignupPage onSignUp={onSignUp}/>
    </div>
  );
}

export default App;
