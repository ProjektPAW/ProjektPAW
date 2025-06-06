import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import profileImg from "./public/imgs/profile.png";
import { sendError, sendSuccess } from "./toast";
import styles from "./styles/header.module.css";

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
              sendSuccess("Zalogowano pomyślnie!");
              refr();
            } else {
              sendError("Logowanie nie powiodło się.");
            }
          } else {
            sendError("Logowanie nie powiodło się.");
          }
        })
        .catch((error) => {
          console.error("Błąd:", error);
          sendError("Logowanie nie powiodło się.");
        });
    } catch (error) {
      sendError("Błąd serwera: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("emailverified");
    sendSuccess("Wylogowano pomyślnie!");
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
                Rejestracja
              </button>
            </Link>
          </form>
        </div>
      ) : (
        <div className={styles.user_info}>
           {verifiedEmail=="false" ?(
              <div className={styles.verify_email_container}>
                <p>
                  Witaj, <strong>{localStorage.getItem("username")}</strong>!
                </p>
                <div style={{ color: '#d32f2f', fontWeight: 'bold' , paddingTop: 4 + 'px'}}>Zweryfikuj swój adres e-mail!</div>
              </div>
             ):(
              <p>
                Witaj, <strong>{localStorage.getItem("username")}</strong>!
              </p>
             )
            }

          <Link to="/profile">
            <button className={`${styles.header_btn} ${styles.profile_btn}`}>
              <img src={profileImg} alt="Profile" />
            </button>
          </Link>
          <button
            className={`${styles.header_btn} ${styles.logout_btn}`}
            onClick={handleLogout}
          >
            Wyloguj
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
