import "./profile.css";
import React, { useEffect, useState } from "react";
import {sendError, sendSuccess, sendWarning} from './toast'
import axios from "axios";

function Profile() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
    });

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        is_private: false,
        photo: null,
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios
            .get("/api/getuser", {
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

    const handleChange = (e) => {
        if(e.target.name=="photo")
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        else
            setFormData({ ...formData, [e.target.name]: e.target.value });

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.photo || !(formData.photo.type.split('/')[0]=="image")) {
            sendWarning("Niedozwolony typ pliku!");
            return;
        }
        try {
            axios
            .post("/api/addphoto",formData, {
                headers: {
                Authorization: localStorage.getItem("jwtToken"),
                "Content-Type": "multipart/form-data"
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    sendError("Authentication failed");
                    return;
                }
                else if(response.status === 201){
                    console.log(response.data);
                    sendSuccess("Photo added successfully!");
                    setShowModal(false);
                }else 
                    sendError("Photo addings failed.");
            })
            .catch((error) => {
                console.error("Błąd:", error);
                sendError("Photo adding failed.");
            });
        } catch (error) {
            sendError("Server error: " + error.message);
        }
    };

    return (
        <div className="page_container">
            <main className="content">
                <div className="profile_card">
                    <h2>Profil</h2>
                    <p>Użytkownik: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                    <button className="open-modal-btn" onClick={() => setShowModal(true)}>
                        Dodaj zdjęcie
                    </button>
                </div>
                {showModal && (
                    <div className="modal_overlay">
                        <div className="modal_content">
                            <span className="close_modal" onClick={() => setShowModal(false)}>x</span>
                            <h3>Dodaj zdjęcie</h3>
                            <form onSubmit={handleSubmit} className="photo-form">
                                <label>Tytuł:</label>
                                <input type="text" name="title" onChange={handleChange} required />
                                <label>Opis:</label>
                                <textarea name="description" onChange={handleChange}/>
                                <label><input type="checkbox" name="is_private" onChange={handleChange} /> Prywatne</label>
                                <label>Zdjęcie:</label>
                                <input type="file" name="photo" accept="image/*" onChange={handleChange} required />
                                <button type="submit">Dodaj</button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Profile;
