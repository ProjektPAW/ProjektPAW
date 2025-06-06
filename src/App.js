import './styles/App.css';
import { useEffect, useState,useContext  } from "react";
import {BrowserRouter, Routes, Route,Navigate,useNavigate  } from "react-router-dom"
import Home from './home/home'
import EmailVerification from './EmailVerification'
import Register from './register'
import Profile from './profile/profile'
import { ToastContainer} from 'react-toastify';
import Header from "./header";
import Footer from "./footer";
import axios from 'axios';
import { AuthProvider, AuthContext } from "./AuthContext";

function AppRoutes() {
  //dane użytkownika z authcontextu
  const { user, isLoggedIn, login, logout } = useContext(AuthContext);
  const [key, setKey] = useState(0); // refr() – zmienia stan key, co powoduje przeładowanie komponentów z kluczem key
  function refr () {setKey((prevKey) => prevKey + 1);}
  const navigate = useNavigate();

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
              //zmiana tokenu przez metodę login z authcontext
              login({
                ...user,
                token: response.data.token,
              });
            }
            else if(response.status === 201){
              //wylogowanie gdy odświeżenie tokenu nie powiodło się
              logout();
              navigate("/");
            }
      })
        .catch((error) => {
            console.error("Błąd: ", error);
            logout();
            navigate("/");
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
  }, [isLoggedIn, user, login, logout, navigate]);
  return (
    <>
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
      </>
  );
}
//opakowanie w authprovider
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;