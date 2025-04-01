import './header.css';
import React, { useState } from "react";
import profileImg from "./public/imgs/profile.png";
import {Outlet, Link} from 'react-router-dom';
import {sendError, sendSuccess} from './toast'

function Header() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLogged, setIsLogged]=useState(
    ()=>{if(localStorage.getItem("jwtToken"))return true; return false;}
  );
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleLogin = async (e) => {
  e.preventDefault();
  try {
      const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
          if(data.token){

            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email);
            setIsLogged(true);

            setFormData({ username: "", password: "" });
            sendSuccess("Logged in successfully!");
          }
          else{
            sendError(data.message || "login failed.");
          }
      } else {
          sendError(data.message || "login failed.");
      }
  } catch (error) {
      console.error("Błąd sieci:", error);
      sendError("Cannot connect to server.");
  }
};

const handleLogout = async (e) => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  sendSuccess("Loggout successfull!");
  setIsLogged(false);
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
