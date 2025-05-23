import passwordInputStyles from "./register.module.css"
import styles from "./profile.module.css";
import photoStyles from './photoGalery.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import React, { useEffect, useState } from "react";
import {sendError, sendSuccess, sendWarning} from './toast'
import axios from "axios";
import privateImg from "./public/imgs/private.png";
import closeImg from "./public/imgs/close.png";
import editImg from "./public/imgs/edit.png";
import deleteImg from "./public/imgs/bin.png";
import { useNavigate } from "react-router-dom";

function Profile({ refr }) {
    const navigate = useNavigate();
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
    const [catalogList, setCatalogList] = useState([]);
    const [checkedCatalogsList, setCheckedCatalogsList] = useState([]);
    const [catalogsLoaded, setCatalogsLoaded] = useState(false);

    const [showEditCatalogModal, setShowEditCatalogModal] = useState(false);
    const [selectedCatalogId, setSelectedCatalogId] = useState(-1);
    const [newCatalogName, setNewCatalogName] = useState("");
                                    
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [changePasswordFromData, setChangePasswordFromData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmedNewPassword: ""
    })

    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(FaEyeSlash);

    const [sortedPhotos, setSortedPhotos] = useState([]);
    const [sortOrder, setSortOrder]=useState("added_desc");
    const [page, setPage]=useState(0);
    const [searchText, setSearchText]=useState("");
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

    const handleChange = (e) => {
        if(e.target.name==="photo")
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        else if (e.target.name === "is_private")
            setFormData({ ...formData, [e.target.name]: e.target.checked });
        else
            setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const prepareEditForm  = (photo) => {
        setCatalogsLoaded(false);
        setSelectedEdit(photo);
        setEditFormData({
            title: photo.title,
            description: photo.description,
            is_private: photo.is_private,
            id_photo: photo.id_photo
        });
        
        axios
            .get("/api/getphotocatalogs", {
                params: {id_photo: photo.id_photo},
                headers: {
                Authorization: localStorage.getItem("jwtToken"),
                },
            })
            .then((response) => {
                let temp=[];
                setCatalogList([]);
                for(var i in response.data){
                   temp.push(response.data[i].id_catalog);
                }
                let catalogObj = {};
                for (let i = 0; i < temp.length; i++)
                    catalogObj[temp[i]] = true;
                setCatalogList(catalogObj);
                
                setCheckedCatalogsList(temp);
                setCatalogsLoaded(true);
            })
            .catch((error) => {
                console.error("Błąd pobierania folderów:", error);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.photo || !(formData.photo.type.split('/')[0]==="image")) {
            sendWarning("Niedozwolony typ pliku!");
            return;
        }
        try {
            let data = new FormData();

            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("is_private", formData.is_private);
            data.append("photo", formData.photo);
            data.append("catalogs_to_add", JSON.stringify(catalogList));

            axios
            .post("/api/addphoto",data, {
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
            .patch("/api/editphoto",{...editFormData, catalogs_to_add:catalogList}, {
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
      
    const handleCatalogChange = (e) => {
        const { name, value } = e.target;
        setNewCatalog((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSetCatalogs = (e)=>{
    const { name, checked } = e.target;
    setCatalogList((prevState) => ({
        ...prevState,
        [name]: checked
    }));
    }

    const getCatalogPhotos = (e) => {
        setSelectedCatalogId(e.target.value);
    };

    const deletePhoto = async (id) => {
        const confirmDelete = window.confirm("Na pewno chcesz usunąć to zdjęcie?");
        if (!confirmDelete) return;
        
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

    const handleEditCatalogSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCatalogId  || newCatalogName.includes(" ")) {
            sendWarning("Set a valid new name!");
            return;
        }

        try {
            const response = await axios.patch(
                "/api/editcatalog",
                {
                    id_catalog: selectedCatalogId,
                    name: newCatalogName,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("jwtToken"),
                    },
                }
            );

            sendSuccess("Katalog został zaktualizowany!");
            setShowEditCatalogModal(false);
            refr();
        } catch (error) {
            console.error("Błąd edycji:", error);
            sendError("Edycja katalogu nie powiodła się.");
        }
    };
      
    const handleDeleteCatalog = async () => {
        const confirmDelete = window.confirm("Na pewno chcesz usunąć ten katalog?");
        if (!confirmDelete) return;

        if (!selectedCatalogId) {
            sendWarning("Nie wybrano katalogu.");
            return;
        }
    
        try {
            const response = await axios.delete("/api/deletecatalog", {
                headers: {
                    Authorization: localStorage.getItem("jwtToken"),
                },
                data: {
                    id_catalog: selectedCatalogId,
                },
            });
    
            sendSuccess("Katalog został usunięty.");
            setShowEditCatalogModal(false);
            refr(); // ← odświeżenie listy katalogów
        } catch (error) {
            console.error("Błąd usuwania:", error);
            sendError("Usunięcie katalogu nie powiodło się.");
        }

    };
    const handleDeleteUser = (e) =>{
        const confirmDelete = window.confirm("Na pewno chcesz usunąć konto?");
        if (!confirmDelete) return;

                try {
            axios
                .delete("/api/deleteuser", {
                    headers: {
                    Authorization: localStorage.getItem("jwtToken"),
                    },
                }) 
                .then((response) => {
                    if (response.status == 200) {
                        sendError(response.data || "deleting failed.");
                        return;
                    }
                    sendSuccess("User deleted successfully!");
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("username");
                    localStorage.removeItem("email");
                    localStorage.removeItem("role");
                    localStorage.removeItem("emailverified");
                    setTimeout(() => window.location.href="/", 2000);
                })
                .catch((error) => {
                    console.error("Błąd:", error);
                    sendError("User deleting failed.");
                });
        } catch (error) {
            sendError("Server error: " + error.message);
        }
    };
    const handleChangePassword = (e) =>{
        setChangePasswordFromData({ ...changePasswordFromData, [e.target.name]: e.target.value });
    }
    const handleSubmitChangePassword = (e) => {
        e.preventDefault();
        if(changePasswordFromData.newPassword!=changePasswordFromData.confirmedNewPassword){
            sendError("Passowrds must match!");
            return;
        }
        try {
            axios
            .patch("/api/changepassword",{currentPassword:changePasswordFromData.oldPassword,newPassword:changePasswordFromData.newPassword}, {
                headers: {
                Authorization: localStorage.getItem("jwtToken"),
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    sendError("Current password incorrect!");
                    return;
                }
                else if(response.status === 201){
                    sendSuccess("Password changed successfully!");
                    setShowChangePasswordModal(false);
                    refr();
                }else 
                    sendError("Password change failed.");
            })
            .catch((error) => {
                console.error("Error:", error);
                sendError("Password change failed.");
            });
        } catch (error) {
            sendError("Server error: " + error.message);
        }
    };
    const handleToggle = () => {
        if (type === 'password') {
            setIcon(FaEye);
            setType('text');  
        } else {
            setIcon(FaEyeSlash);
            setType('password'); 
        }
    };
    const handleSort = (e) => {
        setSortOrder(e.target.value);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const fetchPhotos = (sort, search) => {
        try {
        axios
            .get("/api/paged/getuserphotos", {
            params: {page:page,sort:sortOrder,search:searchText},
            headers: {
                Authorization: localStorage.getItem("jwtToken"),
            },
            })
            .then((response) => {
            setSortedPhotos(response.data);
            })
            .catch((error) => {
            console.error("Błąd podczas pobierania zdjęć:", error);
            });
        } catch (error) {
        sendError("Server error: " + error.message);
        }
    };

    const fetchPhotosFromCatalog = (sort, search, id_catalog) => {
        try {
        axios
            .get("/api/paged/getphotosincatalog", {
            params: {page:page,sort:sortOrder,search:searchText,id_catalog:selectedCatalogId},
            headers: {
                Authorization: localStorage.getItem("jwtToken"),
            },
            })
            .then((response) => {
            setSortedPhotos(response.data);
            })
            .catch((error) => {
            console.error("Błąd podczas pobierania zdjęć:", error);
            });
        } catch (error) {
        sendError("Server error: " + error.message);
        }
    };

    useEffect(() => {
        setPage(0);
        if(selectedCatalogId>=0){
            fetchPhotosFromCatalog(sortOrder, searchText, selectedCatalogId);
        }
        else{
            fetchPhotos(sortOrder, searchText);
        } 
    }, [sortOrder,searchText,selectedCatalogId]);
    return (
        <div className={styles.page_container}>
            <main className={styles.content}>
                <div className={styles.profile_card}>
                    <h2>Profil</h2>
                    <p>Użytkownik: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                    <div className={styles.button_group}>
                        <button className={styles.open_modal_btn} onClick={() => {setCatalogList([]);setShowModal(true);}}>
                            Dodaj zdjęcie
                        </button>
                        <button className={styles.open_modal_btn} onClick={() => setShowChangePasswordModal(true)}>
                            Zmień hasło
                        </button>
                        <button className={styles.delete_account_btn} onClick={handleDeleteUser}>
                            Usuń konto
                        </button>
                    </div>
                </div>
                {showModal && (
                    <div className={styles.modal_overlay} onClick={() => setShowModal(false)}>
                        <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
                        <span className={photoStyles.close_modal} onClick={() => setShowModal(false)}>
                        <img src={closeImg} alt="Close" className={photoStyles.icon_close}/>
                        </span>
                            <h3>Dodaj zdjęcie</h3>
                            <form onSubmit={handleSubmit} className={styles.photo_form}>
                                <label>Tytuł:</label>
                                <input type="text" name="title" onChange={handleChange} required />
                                <label>Opis:</label>
                                <textarea name="description" onChange={handleChange}/>
                                <label><input type="checkbox" name="is_private" onChange={handleChange} /> Prywatne</label>
                                <label>Zdjęcie:</label>
                                <input type="file" name="photo" accept="image/*" onChange={handleChange} required />
                                <label>Dodaj do katalogu</label>
                                <div className={styles.select_catalog}>
                                {catalogs.map((catalog) => ( 
                                    catalog.id_catalog>=0&&(
                                    <div key={catalog.id_catalog}><input type="checkbox" name={catalog.id_catalog} onChange={handleSetCatalogs}/><label>{catalog.name}</label></div>
                                    )
                                ))}
                                </div>
                                <button type="submit">Dodaj</button>
                            </form>
                        </div>
                    </div>
                )}

                <div className={styles.catalog_section_container}>
                    <div className={styles.catalog_container}>
                        <h2>Moje Zdjęcia</h2>
                        <div className={styles.catalog_group}>
                            <select onChange={handleSort} className={styles.sort_dropdown}>
                                <option value="title_asc">Nazwa: A - Z</option>
                                <option value="title_desc">Nazwa: Z - A</option>
                                <option value="added_desc">Data dodania: od najnowszych</option>
                                <option value="added_asc">Data dodania: od najstarszych</option>
                            </select>
                            <input placeholder='Szukaj...' onChange={handleSearch} className={styles.search_input}></input>
                            <select onChange={getCatalogPhotos} className={styles.catalog_dropdown}>
                            {catalogs.map((catalog) => (
                                <option key={catalog.id_catalog} name={catalog.name} value={catalog.id_catalog}>
                                    {catalog.name}
                                </option>
                            ))}
                            
                            </select>
                            <button className={styles.add_catalog_btn} onClick={() => setShowCatalogModal(true)}>
                                Dodaj katalog
                            </button>
                            {selectedCatalogId>=0?(
                            <button className={styles.add_catalog_btn} onClick={() => setShowEditCatalogModal(true)}>
                                Edytuj katalog
                            </button>):
                            <span className={styles.invisible_button}></span>
                            }
                        </div>

                    </div>
                </div>

                <div className={photoStyles.photo_grid}>
                {!Array.isArray(sortedPhotos)||sortedPhotos.length===0? (
                    <div className={styles.catalog_empty}> 
                        {searchText!=""?(<p>Brak zdjęć spełniających kryteria wyszukiwania.</p>):(<p> Katalog pusty</p>)}
                    </div> 
                    ):( sortedPhotos.map((photo) => (
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
                            <h4>{photo.title.length > 20 ? photo.title.slice(0, 20) + '...' : photo.title}</h4>
                        </div>
                        <div>
                            <button className={styles.edit_btn}>
                                <img src={editImg} 
                                    alt="Edit" 
                                    className={styles.icon_edit} 
                                    onClick={() => prepareEditForm(photo)}/>
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
                            <label>Dodaj do katalogu</label>
                            <div className={styles.select_catalog}>
                            {catalogs.map((catalog) => (
                                catalog.id_catalog>=0&&catalogsLoaded&&(
                                <div key={catalog.id_catalog}>
                                <input
                                    type="checkbox"
                                    name={catalog.id_catalog}
                                    onChange={handleSetCatalogs}
                                    defaultChecked={ checkedCatalogsList.includes(catalog.id_catalog)?true:false }
                              />
                              <label>{catalog.name}</label></div>
                            )))}
                            </div>
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
                {showEditCatalogModal && (
                <div className={photoStyles.modal_overlay} onClick={() => setShowEditCatalogModal(false)}>
                    <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
                    <span className={photoStyles.close_modal} onClick={() => setShowEditCatalogModal(false)}>
                        <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
                    </span>

                    <h3>Edytuj katalog</h3>

                    <form onSubmit={handleEditCatalogSubmit} className={styles.photo_form}>
                        <label>Nowa nazwa:</label>
                        <input
                        type="text"
                        name={selectedCatalogId}
                        defaultValue={catalogs.find((element)=> element.id_catalog==selectedCatalogId).name}
                        onChange={(e) => setNewCatalogName(e.target.value)}
                        required
                        />

                        <button type="submit">Zapisz zmiany</button>

                        <button
                            type="button"
                            className= {styles.delete_catalog_btn}
                            onClick={handleDeleteCatalog}
                        >
                        Usuń katalog
                        </button>
                    </form>
                    </div>
                </div>
                )}
                {showChangePasswordModal &&(
                    <div className={photoStyles.modal_overlay} onClick={() => setShowChangePasswordModal(false)}>
                        <div className={photoStyles.modal_photo} onClick={(e) => e.stopPropagation()}>
                            <span className={photoStyles.close_modal} onClick={() => setShowChangePasswordModal(false)}>
                                <img src={closeImg} alt="Close" className={photoStyles.icon_close} />
                            </span>
                            <h3>Zmiana Hasła</h3>
                            <div className={styles.change_password_form}>
                            <form onSubmit={handleSubmitChangePassword} className={styles.photo_form}>
                                <label>Podaj obecne hasło:</label>
                                <div className={styles.password_container}>
                                    <input
                                        name="oldPassword"
                                        type={type}
                                        placeholder="Podaj obecne hasło..."
                                        onChange={handleChangePassword}
                                        required
                                    />
                                    <span className={passwordInputStyles.password_icon} onClick={handleToggle}>
                                        {icon}
                                    </span>
                                </div>
                                <label>Podaj nowe hasło:</label>
                                <div className={styles.password_container}>
                                    <input
                                    name="newPassword"
                                    type={type}
                                    placeholder="Podaj nowe hasło..."
                                    onChange={handleChangePassword}
                                    required
                                    />
                                    <span className={passwordInputStyles.password_icon} onClick={handleToggle}>
                                        {icon}
                                    </span>
                                </div>
                                <label>Potwierdź nowe hasło:</label>
                                <div className={styles.password_container}>
                                    <input
                                        name="confirmedNewPassword"
                                        type={type}
                                        placeholder="Potwierdź nowe hasło..."
                                        onChange={handleChangePassword}
                                        required
                                    />
                                    <span className={passwordInputStyles.password_icon} onClick={handleToggle}>
                                        {icon}
                                    </span>
                                </div>
                                <button type="submit" className={styles.change_password_btn}>Zapisz zmiany</button>
                            </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Profile;
