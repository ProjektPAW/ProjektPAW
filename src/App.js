import './App.css';
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './home'
import Register from './register'
import { ToastContainer} from 'react-toastify';
import Header from "./header";
import Footer from "./footer";

function App() {
  return (
    <BrowserRouter>
    <Header/>
    <ToastContainer className="toast-position"/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
export default App;