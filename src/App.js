import './styles/App.css';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client"
import {BrowserRouter, Routes, Route,Navigate } from "react-router-dom"
import Home from './home'
import EmailVerification from './EmailVerification'
import Register from './register'
import Profile from './profile/profile'
import { ToastContainer} from 'react-toastify';
import Header from "./header";
import Footer from "./footer";
import axios from 'axios';

function App() {
  const [key, setKey] = useState(0);
  function refr () {setKey((prevKey) => prevKey + 1);}

  const isLoggedIn = localStorage.getItem("jwtToken") !== null;

  function refreshToken() {
      try{
        axios
        .post("/api/refreshtoken",{},{
            headers: {
              Authorization: localStorage.getItem("jwtToken"),
            },
        })
        .then((response) => {
            if (response.status === 200) {
                localStorage.setItem("jwtToken",-1);
                setTimeout(() => window.location.href="/", 2000);
                return;
            }
            else if(response.status === 201){
              localStorage.setItem("jwtToken",response.data.token);
            }
      })
        .catch((error) => {
            console.error("Błąd: ", error);
        });
    } catch (error) {
        console.error("Błąd serwera: " + error.message);
    }
  };
  useEffect(()=>{
    if(isLoggedIn)
      setInterval(refreshToken, 900000);
  },[isLoggedIn]);
  return (
    <BrowserRouter>
    <Header refr={refr}/>
    <ToastContainer className="toast-position"/>
      <Routes >
        <Route path="/" element={<Home key={key} refr={refr}/>}/>
        <Route path="/register" element={<Register key={key}/>}/>
        <Route path="/profile"  element={isLoggedIn ? <Profile key={key} refr={refr} /> : <Navigate to="/" />} />
        <Route path="/verify-email" element={<EmailVerification key={key} refr={refr} />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
export default App;