import './App.css';
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './home'
import Register from './register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;