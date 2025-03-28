import './header.css';
import React, { useState } from "react";
import profileImg from "./public/imgs/profile.png";
import {Outlet, Link} from 'react-router-dom';

function Header() {
  const [isLogged, setIsLogged] = useState(0);
  const [userName, setUserName] = useState("Hieronim");

  return (
    <header>
      <h1>Galeria</h1>
      {isLogged === 0 ? (
        <div id="login_form">
          <form>
            <input type="text" placeholder="Login" />
            <input type="password" placeholder="Password" />
            <button className="header_btn" id="login_btn">Login</button>
            <Link to="/register"><button className="header_btn" id="register_btn">Register</button></Link>
          </form>
        </div>
      ) : (
        <div id="user_info">
          <p>Hello, <strong>{userName}</strong>!</p>
          <button className="header_btn" id="profile_btn"><img src={profileImg}></img></button>
          <button className="header_btn" id="logout_btn">Logout</button>
        </div>
      )}
    </header>
  );
}
export default Header;
