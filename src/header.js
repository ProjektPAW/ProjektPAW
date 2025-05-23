import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import profileImg from "./public/imgs/profile.png";
import { sendError, sendSuccess } from "./toast";
import styles from "./header.module.css";

function Header({ refr }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLogged, setIsLogged] = useState(() => !!localStorage.getItem("jwtToken"));
  const [verifiedEmail, setVerifiedEmail] = useState(localStorage.getItem("emailverified"));

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      axios
        .post("/api/login", formData)
        .then((response) => {
          const data = response.data;
          if (response.status === 200) {
            if (data.token) {
              localStorage.setItem("jwtToken", data.token);
              localStorage.setItem("username", data.username);
              localStorage.setItem("email", data.email);
              localStorage.setItem("role", data.role);
              localStorage.setItem("emailverified", data.emailverified);
              setIsLogged(true);
              setFormData({ username: "", password: "" });
              sendSuccess("Logged in successfully!");
              refr();
            } else {
              sendError(data.message || "Login failed.");
            }
          } else {
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

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("emailverified");
    sendSuccess("Logout successful!");
    setIsLogged(false);
    refr();
  };

  return (
    <header className={styles.header}>
      <Link to="/">
        <h1 className={styles.title}>Galeria</h1>
      </Link>
      {!isLogged ? (
        <div className={styles.loginForm}>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Login"
              name="username"
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              placeholder="Password"
            />
            <button type="submit" className={`${styles.header_btn} ${styles.login_btn}`}>
              Login
            </button>
            <Link to="/register">
              <button className={`${styles.header_btn} ${styles.register_btn}`}>
                Register
              </button>
            </Link>
          </form>
        </div>
      ) : (
        <div className={styles.user_info}>
           {verifiedEmail=="false" &&( <div style={{color:'red'}}>Please verify your email!</div>)}
          <p>
            Hello, <strong>{localStorage.getItem("username")}</strong>!
          </p>
          <Link to="/profile">
            <button className={`${styles.header_btn} ${styles.profile_btn}`}>
              <img src={profileImg} alt="Profile" />
            </button>
          </Link>
          <button
            className={`${styles.header_btn} ${styles.logout_btn}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
