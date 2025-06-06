import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import profileImg from "./public/imgs/profile.png";
import { sendError, sendSuccess } from "./toast";
import styles from "./styles/header.module.css";
import { AuthContext } from "./AuthContext";

function Header({ refr }) {
  // Stan do przechowywania danych formularza logowania
  const [formData, setFormData] = useState({ username: "", password: "" });
  //dane z authContextu
  const { user, isLoggedIn, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Obsługa zmian w polach formularza logowania
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Obsługa wysłania formularza logowania
  const handleLogin = (e) => {
    e.preventDefault();
    try {
      axios
        .post("/api/login", formData)
        .then((response) => {
          const data = response.data;
          if (response.status === 200) {
            if (data.token) {
              // Jeśli token zwrócony, zapisanie danych w authContext i przekierowanie na /
              login(response.data);
              sendSuccess("Zalogowano pomyślnie!");
              refr();
              navigate("/");
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

  // Wylogowanie: usuwamy dane z localStorage i aktualizujemy stan
  const handleLogout = () => {
    logout();
    sendSuccess("Wylogowano pomyślnie!");
    navigate("/");
  };

  return (
    
    <header className={styles.header}>
      <Link to="/">
        <h1 className={styles.title}>Galeria</h1>
      </Link>
      {!isLoggedIn  ? (
        // Formularz logowania jeśli użytkownik niezalogowany
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
        // Widok po zalogowaniu
        <div className={styles.user_info}>
           { user?.emailverified===false ?(
              // Jeśli email niezweryfikowany, pokazujemy komunikat
              <div className={styles.verify_email_container}>
                <p>
                  Witaj, <strong>{user?.username}</strong>!
                </p>
                <div style={{ color: '#d32f2f', fontWeight: 'bold' , paddingTop: 4 + 'px'}}>Zweryfikuj swój adres e-mail!</div>
              </div>
             ):(
              <p>
                Witaj, <strong>{user?.username}</strong>!
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
