import "./profile.css";
import React, { useEffect, useState } from "react";
import {sendError, sendSuccess, sendWarning} from './toast'
import axios from "axios";

function Profile() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
    });

    useEffect(() => {
        axios
            .get("http://localhost:5000/getuser", {
                headers: {
                Authorization: localStorage.getItem("jwtToken"),
                },
            })
            .then((response) => {
                console.log(response.data);
                setUserData(response.data);
            })
            .catch((error) => {
                console.error("Błąd pobierania użytkownika:", error);
            });
    }, []);

    return (
        <div className="page_container">
            <main className="content">
                <h2>Profil</h2>
                <p>Użytkownik: {userData.username}</p>
                <p>Email: {userData.email}</p>
            </main>
        </div>
    );
}

export default Profile;
