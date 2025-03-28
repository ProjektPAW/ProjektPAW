import "./register.css";
import Header from "./header";
import Footer from "./footer";
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import icons from react-icons
import React, { useState } from "react";

function Register() {
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(FaEyeSlash);  // Default to eye-off (hidden)

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(FaEye);  // Show the eye icon when the password is hidden
            setType('text');  // Change input type to text
        } else {
            setIcon(FaEyeSlash);  // Hide the eye icon when the password is visible
            setType('password');  // Change input type to password
        }
    };

    return (
        <div className="page_container">
            <Header />
            <main className="content">
                <div className="register_form">
                    <h2>Register</h2>
                    <form>
                        <label>Login:</label>
                        <input type="text" placeholder="Enter your login" />

                        <label>E-mail:</label>
                        <input type="email" placeholder="Enter your email" />

                        <label>Password:</label>
                        <div className="password_container">
                            <input
                                type={type}
                                name="password"
                                placeholder="Enter password"
                            />
                            <span className="password-icon" onClick={handleToggle}>
                                {icon}
                            </span>
                        </div>

                        <label>Confirm Password:</label>
                        <div className="password_container">
                            <input
                                type={type}
                                name="password"
                                placeholder="Confirm password"
                            />
                            <span className="password-icon" onClick={handleToggle}>
                                {icon}
                            </span>
                        </div>
                        
                        <div id="new_register_btn">
                            <button type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Register;
