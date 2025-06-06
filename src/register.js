import styles from "./styles/register.module.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {sendError, sendSuccess, sendWarning} from './toast'
import axios from "axios";

function Register() {
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(FaEyeSlash); 
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(FaEye);
            setType('text'); 
        } else {
            setIcon(FaEyeSlash);
            setType('password');
        }
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            sendWarning("Wszystkie pola są wymagane!");
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            sendError("Hasła muszą się zgadzać");
            return;
        }
        
        try {
            axios
                .post("/api/register", formData) 
                .then((response) => {
                    if (response.status === 200) {
                        sendError("Rejestracja nie powiodła się!");
                        return;
                    }
                    sendSuccess("Rejestracja zakończona pomyślnie!");
                    setTimeout(() => navigate("/"), 2000);
                })
                .catch((error) => {
                    console.error("Błąd:", error);
                    sendError("Rejestracja nie powiodła się!");
                });
        } catch (error) {
            sendError("Błąd serwera:  " + error.message);
        }

    };

    return (
        <div className={styles.page_container}>
            <main className={styles.content}>
                <div className={styles.register_form}>
                    <h2>Zarejestruj się</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Login:</label>
                        <input type="text" name="username" onChange={handleChange} placeholder="Login" />

                        <label>E-mail:</label>
                        <input type="email" name="email" onChange={handleChange} placeholder="E-mail" />

                        <label>Hasło:</label>
                        <div className={styles.password_container}>
                            <input
                                type={type}
                                name="password"
                                placeholder="Hasło"
                                onChange={handleChange}
                            />
                            <span className={styles.password_icon} onClick={handleToggle}>
                                {icon}
                            </span>
                        </div>

                        <label>Potwierdź hasło:</label>
                        <div className={styles.password_container}>
                            <input
                                type={type}
                                name="confirmPassword"
                                placeholder="Potwierdź hasło"
                                onChange={handleChange}
                            />
                            <span className={styles.password_icon} onClick={handleToggle}>
                                {icon}
                            </span>
                        </div>
                        
                        <div className={styles.register_btn}>
                            <button type="submit">Zarejestruj</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Register;
