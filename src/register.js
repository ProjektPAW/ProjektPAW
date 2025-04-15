import "./register.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import icons from react-icons
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {sendError, sendSuccess, sendWarning} from './toast'
import axios from "axios";

function Register() {
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(FaEyeSlash);  // Default to eye-off (hidden)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(FaEye);  // Show the eye icon when the password is hidden
            setType('text');  // Change input type to text
        } else {
            setIcon(FaEyeSlash);  // Hide the eye icon when the password is visible
            setType('password');  // Change input type to password
        }
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            sendWarning("All fields are required.");
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            sendError("Passwords do not match.");
            return;
        }
        
        try {
            axios
                .post("/api/register", formData) 
                .then((response) => {
                    if (response.status === 200) {
                        sendError(response.data.message || "Registration failed.");
                        return;
                    }
                    sendSuccess("User registered successfully!");
                    setTimeout(() => navigate("/"), 2000);
                })
                .catch((error) => {
                    console.error("Błąd:", error);
                    sendError("Registration failed.");
                });
        } catch (error) {
            sendError("Server error: " + error.message);
        }

    };

    return (
        <div className="page_container">
            <main className="content">
                <div className="register_form">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Login:</label>
                        <input type="text" name="username" onChange={handleChange} placeholder="Enter your login" />

                        <label>E-mail:</label>
                        <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" />

                        <label>Password:</label>
                        <div className="password_container">
                            <input
                                type={type}
                                name="password"
                                placeholder="Enter password"
                                onChange={handleChange}
                            />
                            <span className="password-icon" onClick={handleToggle}>
                                {icon}
                            </span>
                        </div>

                        <label>Confirm Password:</label>
                        <div className="password_container">
                            <input
                                type={type}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                onChange={handleChange}
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
        </div>
    );
}

export default Register;
