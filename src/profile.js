import styles from "./profile.module.css";
import photoStyles from './photoGalery.module.css';
import React, { useEffect, useState } from "react";
import {sendError, sendSuccess, sendWarning} from './toast'
import axios from "axios";
import privateImg from "./public/imgs/private.png";
import closeImg from "./public/imgs/close.png";
import editImg from "./public/imgs/edit.png";
import deleteImg from "./public/imgs/bin.png";
import tickImg from "./public/imgs/check.png";

function Profile({ refr }) {
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

    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        is_private: false,
        id_photo:null
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedEdit, setSelectedEdit] = useState(null);
    const [showCatalogModal, setShowCatalogModal] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const allOption = { id_catalog: -1, name: 'All', id_user: null };

    useEffect(() => {
        axios
        .get("/api/getusercatalogs", {
            headers: {
            Authorization: localStorage.getItem("jwtToken"),
            },
        })
        .then((response) => {
            setCatalogs(response.data);
            setCatalogs([allOption, ...response.data]);
        })
        .catch((error) => {
            console.error("Błąd pobierania folderów:", error);
        });
      }, []);
      
    useEffect(() => {
        axios
            .get("/api/getuser", {
                headers: {
                Authorization: localStorage.getItem("jwtToken"),
                },
            })
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error("Błąd pobierania użytkownika:", error);
            });
    }, []);

    useEffect(() => {
        axios
            .get("/api/getuserphotos", {
                headers: {
                Authorization: localStorage.getItem("jwtToken"),
                },
            })
            .then(response => {
                setPhotos(response.data);
            })
            .catch(error => {
                console.error("Błąd podczas pobierania zdjęć:", error);
            });
      }, []);

    const handleChange = (e) => {
        if(e.target.name==="photo")
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        else if (e.target.name === "is_private")
            setFormData({ ...formData, [e.target.name]: e.target.checked });
        else
            setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.photo || !(formData.photo.type.split('/')[0]==="image")) {
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
                    sendSuccess("Photo added successfully!");
                    setShowModal(false);
                    refr();
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

    const handleEditChange = (e) => {
        if (e.target.name === "is_private")
            setEditFormData({ ...editFormData, [e.target.name]: e.target.checked, id_photo:selectedEdit.id_photo });
        else
            setEditFormData({ ...editFormData, [e.target.name]: e.target.value, id_photo:selectedEdit.id_photo});
    };
    const handleEditSubmit = async (e) => {
        try {
            axios
            .patch("/api/editphoto",editFormData, {
                headers: {
                Authorization: localStorage.getItem("jwtToken"),
                "Content-Type": "application/json"
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    sendError("Authentication failed");
                    return;
                }
                else if(response.status === 201){
                    sendSuccess("Photo edited successfully!");
                    setShowModal(false);
                    refr();
                }else 
                    sendError("Photo edit failed.");
            })
            .catch((error) => {
                console.error("Błąd:", error);
                sendError("Photo edit failed.");
            });
        } catch (error) {
            sendError("Server error: " + error.message);
        }
    };

    const [newCatalog, setNewCatalog] = useState({name: ''});
      
      // Handle changes to the catalog form (name and description)
      const handleCatalogChange = (e) => {
        const { name, value } = e.target;
        setNewCatalog((prevState) => ({
          ...prevState,
          [name]: value
        }));
      };

      const getCatalogPhotos = (e) => {
        let id= e.target.value;
        if(id>-1){
            axios
                .get("/api/getphotosincatalog", {
                    params: { id_catalog: id },
                    headers: {
                    Authorization: localStorage.getItem("jwtToken"),
                    },
                })
                .then((response) => {
                    setPhotos(response.data);
                })
                .catch((error) => {
                    console.error("Błąd podczas pobierania zdjęć:", error);
                });
        }
        else{
            axios
                .get("/api/getuserphotos", {
                    headers: {
                    Authorization: localStorage.getItem("jwtToken"),
                    },
                })
                .then(response => {
                    setPhotos(response.data);
                })
                .catch(error => {
                    console.error("Błąd podczas pobierania zdjęć:", error);
                });
        }
      };

      const deletePhoto = async (id) => {
        try {
            axios
                .delete("/api/deletephoto", {
                    data: { id_photo: id },
                    headers: {
                    Authorization: localStorage.getItem("jwtToken"),
                    },
                }) 
                .then((response) => {
                    if (response.status == 200) {
                        sendError(response.data || "deleting failed.");
                        return;
                    }
                    sendSuccess("Photo deleted successfully!");
                    refr();
                })
                .catch((error) => {
                    console.error("Błąd:", error);
                    sendError("Photo deleting failed.");
                });
        } catch (error) {
            sendError("Server error: " + error.message);
        }

    };

    const CreateCatalogue = async (e) => {
        if (!newCatalog || newCatalog.name=="" || newCatalog.name.includes(' ')) {
            sendWarning("Set valid name!");
            return;
        }
        
        try {
            axios
                .post("/api/addcatalog", newCatalog, {
                    headers: {
                    Authorization: localStorage.getItem("jwtToken"),
                    },
                }) 
                .then((response) => {
                    if (response.status === 200) {
                        sendError(response.data.message || "Folder adding failed.");
                        return;
                    }
                    sendSuccess("Folder added successfully!");
                    setShowCatalogModal(false);
                    refr();
                })
                .catch((error) => {
                    console.error("Błąd:", error);
                    sendError("Folder adding failed.");
                });
        } catch (error) {
            sendError("Server error: " + error.message);
        }

    };

    return (
        <div className={styles.page_container}>
            <main className={styles.content}>
                <div className={styles.profile_card}>
                    <h2>Profil</h2>
                    <p>Użytkownik: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                    <button className={styles.open_modal_btn} onClick={() => setShowModal(true)}>
                        Dodaj zdjęcie
                    </button>
                </div>
                {showModal && (
                    <div className={styles.modal_overlay}>
                        <div className={styles.modal_content}>
                            <span className={styles.close_modal} onClick={() => setShowModal(false)}>x</span>
                            <h3>Dodaj zdjęcie</h3>
                            <form onSubmit={handleSubmit} className={styles.photo_form}>
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

                <div className={styles.catalog_section_container}>
                    <div className={styles.catalog_container}>
                        <h2>Moje Zdjęcia</h2>
                        <div className={styles.catalog_group}>
                            <select onChange={getCatalogPhotos} className={styles.catalog_dropdown}>
                            {catalogs.map((catalog) => (
                                <option key={catalog.id_catalog} value={catalog.id_catalog}>
                                {catalog.name}
                                </option>
                            ))}
                            </select>
                            <button className={styles.add_catalog_btn} onClick={() => setShowCatalogModal(true)}>
                                Dodaj katalog
                            </button>
                        </div>

                    </div>
                </div>
                
                <div className={photoStyles.photo_grid}>
                {!Array.isArray(photos)? <div> <p>katalog pusty</p> </div> :( photos.map((photo) => (
                    <div key={photo.id_photo} className={photoStyles.photo_card}>
                    <img
                        src={`/api/${photo.path}`}
                        alt={photo.title}
                        onClick={() => setSelectedPhoto(photo)}
                        className={`${photoStyles.clickable} ${photoStyles.photo}`}
                    />
                    <div className={styles.title_container}>
                        <div className={styles.padlock_container}>
                            {photo.is_private?(
                                <img src={privateImg} alt="Private" className={styles.icon} />):("")}
                            <h4>{photo.title.length > 25 ? photo.title.slice(0, 25) + '...' : photo.title}</h4>
                        </div>
                        <div>
                            <button className={styles.edit_btn}>
                                <img src={editImg} 
                                    alt="Edit" 
                                    className={styles.icon_edit} 
                                    onClick={() => {
                                        setSelectedEdit(photo);
                                        setEditFormData({
                                            title: photo.title,
                                            description: photo.description,
                                            is_private: photo.is_private,
                                            id_photo: photo.id_photo
                                        });
                                    }}/>
                            </button>
                            <button className ={styles.delete_btn} onClick={() => deletePhoto(photo.id_photo)}>
                                <img src={deleteImg}
                                    alt = "Delete"
                                    className={styles.icon_delete}
                                />
                            </button>
                        </div>
                    </div>
                    <p>{photo.description.length > 25 ? photo.description.slice(0, 25) + '...' : photo.description}</p>
                    </div>
                )))}
                </div>
                {selectedPhoto && (
                <div className={photoStyles.modal_overlay} onClick={() => setSelectedPhoto(null)}>
                    <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
                    <span className={photoStyles.close_modal} onClick={() => setSelectedPhoto(null)}>
                        <img src={closeImg} alt="Close" className={photoStyles.icon_close}/>
                    </span>
                    <img src={`/api/${selectedPhoto.path}`} alt={selectedPhoto.title} />
                    <h4>Tytuł: {selectedPhoto.title}</h4>
                    <p>{selectedPhoto.description.length===0?"Brak opisu":"Opis: "+selectedPhoto.description}</p>
                    <p>Data dodania:  
                        {" "+new Date(selectedPhoto.added).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour:"numeric",
                        minute:"numeric"
                        })}
                    </p>
                    </div>
                </div>
                )}
                {selectedEdit && (
                <div className={photoStyles.modal_overlay} onClick={() => setSelectedEdit(null)}>
                    <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
                        <span className={photoStyles.close_modal} onClick={() => setSelectedEdit(null)}>
                            <img src={closeImg} alt="Close" className={photoStyles.icon_close}/>
                        </span>
                        <img src={`/api/${selectedEdit.path}`} alt={selectedEdit.title} />
                        <form className={styles.photo_form}>
                            <label>Tytuł:</label>
                            <input type="text" name="title" onChange={handleEditChange} required defaultValue={selectedEdit.title}/>
                            <label>Opis:</label>
                            <textarea name="description" onChange={handleEditChange} defaultValue={selectedEdit.description}/>
                            <label><input type="checkbox" name="is_private" onChange={handleEditChange} defaultChecked={selectedEdit.is_private}/> Prywatne</label>
                            <button type="button" onClick={handleEditSubmit} >Zapisz zmiany</button>
                        </form>
                    </div>
                </div>
                )}
                {showCatalogModal && (
                    <div className={photoStyles.modal_overlay} onClick={() => setShowCatalogModal(false)}>
                        <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
                        <span className={photoStyles.close_modal} onClick={() => setShowCatalogModal(false)}>
                            <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
                        </span>
                        <h3>Dodaj katalog</h3>
                        <form className={styles.photo_form}>
                            <label>Nazwa katalogu:</label>
                            <input type="text"name="name" value={newCatalog.name} onChange={handleCatalogChange} required/>
                            <button type="button" onClick={() => CreateCatalogue()}>Utwórz katalog</button>
                        </form>
                        </div>
                    </div>
                    )}

            </main>
        </div>
    );
}

export default Profile;
