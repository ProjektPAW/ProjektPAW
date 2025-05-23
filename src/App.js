import './App.css';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client"
import {BrowserRouter, Routes, Route,Navigate } from "react-router-dom"
import Home from './home'
import EmailVerification from './EmailVerification'
import Register from './register'
import Profile from './profile'
import { ToastContainer} from 'react-toastify';
import Header from "./header";
import Footer from "./footer";

function App() {
  const [key, setKey] = useState(0);
  function refr () {setKey((prevKey) => prevKey + 1);}

  const isLoggedIn = localStorage.getItem("jwtToken") !== null;

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