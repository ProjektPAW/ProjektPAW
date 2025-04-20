import React from "react";
import { Link } from "react-router-dom";
import styles from "./footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_div}>
        <h3>Project PAW</h3>
        <p>
          Website created within a project for <br /> web application
          development class.
        </p>
      </div>
      <div className={styles.footer_div}>
        <h3>Contact</h3>
        <p>ProjectPAW@gmail.com</p>
      </div>
      <div className={styles.footer_div}>
        <Link to="/"><h3>Home page</h3></Link>
        <Link to="/profile"><h3>Profile</h3></Link>
        <Link to="/register"><h3>Create Account</h3></Link>
      </div>
    </footer>
  );
}

export default Footer;
