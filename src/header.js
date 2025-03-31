import './header.css';
import React, { useState } from "react";
import profileImg from "./public/imgs/profile.png";
import {Outlet, Link} from 'react-router-dom';

function Header() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

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

            setMessage("Logged in successfully!");
          }
          else{
            setMessage(data.message || "login failed.");
          }
      } else {
          setMessage(data.message || "login failed.");
      }
  } catch (error) {
      console.error("Błąd sieci:", error);
      setMessage("Cannot connect to server.");
  }
};
const handleLogout = async (e) => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  setMessage("Loggout successfull!");

};
  return (
    <header>
      <h1>Galeria</h1>
      {!localStorage.getItem('jwtToken') ? (
        <div id="login_form">
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Login"  name="username"  onChange={handleInputChange}/>
            <input type="password" name="password" onChange={handleInputChange} placeholder="Password" />
            <button className="header_btn" id="login_btn">Login</button>
            <Link to="/register"><button className="header_btn" id="register_btn">Register</button></Link>
          </form>
          {message &&<p>{message}</p>}
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
