import './footer.css';
import React from "react";
import {Outlet, Link} from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="footer_div">
        <h3>Project PAW</h3>
        <p>Website created within a project for <br/> web application development class.</p>
      </div>
      <div className="footer_div">
        <h3>Contact</h3>
        <p>ProjectPAW@gmail.com</p>
      </div>
      <div className="footer_div">
        <Link to="/"><h3>Home page</h3></Link>
        <Link to="#"><h3>Profile</h3></Link>
        <Link to="/register"><h3>Create Account</h3></Link>
      </div>
    </footer>
  );
}

export default Footer;
