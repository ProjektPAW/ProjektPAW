import "./register.css";
import Header from "./header";
import Footer from "./footer";
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import icons from react-icons
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(FaEyeSlash);  // Default to eye-off (hidden)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
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
        setMessage("");
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setMessage("All fields are required.");
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();

            if (response.status === 200) {
                setMessage(data.message || "Registration failed.");
                return;
            }
            else if (response.ok) {
                setMessage("User registered successfully!");
                setTimeout(() => navigate("/"), 2000);
                return;
            } else {
                setMessage(data.message || "Registration failed.");
            }
        } catch (error) {
            setMessage("Server error: " + error.message);
        }
    };

    return (
        <div className="page_container">
            <Header />
            <main className="content">
                <div className="register_form">
                    <h2>Register</h2>
                    {message && <p className="message">{message}</p>}
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
            <Footer />
        </div>
    );
}

export default Register;
