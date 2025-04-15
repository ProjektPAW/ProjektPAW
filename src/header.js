import './header.css';
import React, { useState } from "react";
import profileImg from "./public/imgs/profile.png";
import {Outlet, Link} from 'react-router-dom';
import {sendError, sendSuccess} from './toast'
import axios from "axios";

function Header({ refr }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLogged, setIsLogged]=useState(
    ()=>{if(localStorage.getItem("jwtToken"))return true; return false;}
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleLogin = (e) => {
  e.preventDefault();
  try{
    axios
      .post("/api/login", formData)
      .then((response) => {
          const data = response.data;
          if (response.status=== 200) {
            if (data.token) {
                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("email", data.email);
                setIsLogged(true);

                setFormData({ username: "", password: "" });
                sendSuccess("Logged in successfully!");
                refr();
            } else {
                sendError(data.message || "Login failed.");
            }
          }else {
              sendError(data.message || "Login failed.");
          }
      })
      .catch((error) => {
          console.error("Błąd:", error);
          sendError("Login failed.");
      });
  } catch (error) {
      sendError("Server error: " + error.message);
  }
};

const handleLogout = async (e) => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  sendSuccess("Loggout successfull!");
  setIsLogged(false);
  refr();
};
  return (
    <header>
      <Link to="/"><h1>Galeria</h1></Link>
      {!isLogged ? (
        <div id="login_form">
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Login"  name="username"  onChange={handleInputChange}/>
            <input type="password" name="password" onChange={handleInputChange} placeholder="Password" />
            <button className="header_btn" id="login_btn" >Login</button>
            <Link to="/register"><button className="header_btn" id="register_btn">Register</button></Link>
          </form>
        </div>
      ) : (
        <div id="user_info">
          <p>Hello, <strong>  {localStorage.getItem('username')} </strong>!</p>
          <button className="header_btn" id="profile_btn"><img src={profileImg}></img></button>
          <button className="header_btn" id="logout_btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}
export default Header;
