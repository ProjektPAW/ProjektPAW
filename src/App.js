import './styles/App.css';
import React, { useEffect, useState } from "react";
import {BrowserRouter, Routes, Route,Navigate } from "react-router-dom"
import Home from './home/home'
import EmailVerification from './EmailVerification'
import Register from './register'
import Profile from './profile/profile'
import { ToastContainer} from 'react-toastify';
import Header from "./header";
import Footer from "./footer";
import axios from 'axios';

function App() {
  const [key, setKey] = useState(0); // refr() – zmienia stan key, co powoduje przeładowanie komponentów z kluczem key
  function refr () {setKey((prevKey) => prevKey + 1);}

   // Sprawdza czy token JWT istnieje w localStorage, by określić, czy użytkownik jest zalogowany
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
                // Status 200 – token nieważny lub sesja wygasła; usuń token i przekieruj do strony głównej
                localStorage.removeItem("jwtToken");
                setTimeout(() => window.location.href = "/", 2000);
                return;
            }
            else if(response.status === 201){
              // Status 201 – nowy token dostępny, podmień go w localStorage
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
  useEffect(() => {
    if (isLoggedIn) {
      // Ustawia odświeżanie tokena co 15 minut (900 000 ms)
      const intervalId = setInterval(refreshToken, 900000);
      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn]);
  return (
    <BrowserRouter>
    <Header refr={refr}/>
    <ToastContainer className="toast-position"/>
      <Routes >
        <Route path="/" element={<Home key={key} refr={refr}/>}/>
        <Route path="/register" element={<Register key={key}/>}/>
        {/* Profile dostępny tylko gdy zalogowany, inaczej przekierowanie na "/" */}
        <Route path="/profile"  element={isLoggedIn ? <Profile key={key} refr={refr} /> : <Navigate to="/" />} />
        <Route path="/verify-email" element={<EmailVerification key={key} refr={refr} />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
export default App;