
import './App.css';
import SignupPage from './components/SignUp';
import axios from 'axios';
import { useState } from "react";

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

function App() {
  const [alertText, setAlertText] = useState("");

const onSignUp = async(formData, setAlertText)=>{
  try {
    const Api_data = required_api_data(formData);
    const res = await axios.post('http://localhost:3000/user/register', Api_data);
    console.log(res.data);
  } catch(err) {
    if(err.response){
      setAlertText(err.response.data.message);
      }
    }
  }


  return (
    <div className="App">
    <SignupPage onSignUp={(formData)=>onSignUp(formData, setAlertText)} alertText={alertText}/>
    </div>
  );
}

export default App;
