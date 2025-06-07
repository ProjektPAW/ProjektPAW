import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_div}>
        <h3>Projekt PAW</h3>
        <p>
          Strona stworzona w ramach projektu <br/>Projektowania Aplikacji Webowych.
        </p>
      </div>
      <div className={styles.footer_div}>
        <h3>Kontakt</h3>
        <p>projekt.paw.email@gmail.com</p>
      </div>
      <div className={styles.footer_div}>
        <Link to="/"><h3>Strona Główna</h3></Link>
        <Link to="/profile"><h3>Profil</h3></Link>
        <Link to="/register"><h3>Utwórz konto</h3></Link>
      </div>
    </footer>
  );
}

export default Footer;
