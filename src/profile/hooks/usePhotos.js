import { useState, useEffect, useRef,useContext  } from "react";
import axios from "axios";
import { sendError, sendSuccess, sendWarning } from "../../toast";
import { AuthContext } from "../../AuthContext";

// Hook zarządzający zdjęciami (dodawanie, edycja, usuwanie, pobieranie)
export default function usePhotos(refr, selectedCatalogId) {
  //pobranie danych z authcontext
  const { user } = useContext(AuthContext);
  const token = user?.token;
  // Lista zdjęć + kontrola paginacji i ładowania
  const [sortedPhotos, setSortedPhotos] = useState([]);
  const [page, setPage] = useState(0); // aktualna strona
  const [sortOrder, setSortOrder] = useState("added_desc");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); // status ładowania zdjęć
  const [fetchNoMore, setFetchNoMore] = useState(false); // czy wszystkie zdjęcia zostały załadowane

  const debounceTimeoutRef = useRef(null);

  // Formularz dodawania zdjęcia
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_private: false,
    photo: null,
  });

  // Formularz edycji zdjęcia
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    is_private: false,
    id_photo: null,
  });

   // Resetowanie listy i pobranie zdjęć przy zmianie sortowania, wyszukiwania lub katalogu
  useEffect(() => {
    setSortedPhotos([]);
    setPage(0);
    setFetchNoMore(false);

    if (selectedCatalogId >= 0) {
      fetchPhotosFromCatalog(0, sortOrder, searchText);
    } else {
      fetchPhotos(0, sortOrder, searchText);
    }
  }, [sortOrder, searchText, selectedCatalogId]);

  // Obsługa scrollowania: wczytywanie kolejnych zdjęć gdy użytkownik zbliży się do dołu strony
  const handleScroll = () => {
    if (fetchNoMore || loading) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight - scrollTop < 200) {
      setLoading(true);
      if (selectedCatalogId >= 0) {
        fetchPhotosFromCatalog(page + 1, sortOrder, searchText);
      } else {
        fetchPhotos(page + 1, sortOrder, searchText);
      }
    }
  };

  // Dodanie/odpięcie listenera scrollowania
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, fetchNoMore, page, sortOrder, searchText, selectedCatalogId]);

  // Pobieranie zdjęć użytkownika (bez filtrowania po katalogu)
  const fetchPhotos = (pageToFetch = 0, sort = sortOrder, search = searchText) => {
    axios
      .get("/api/paged/getuserphotos", {
        params: { page: pageToFetch, sort, search },
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.status === 201) {
          setSortedPhotos((prev) => {
            // Dodaj nowe zdjęcia jeśli ich jeszcze nie było
            const existingIds = new Set(prev.map((p) => p.id_photo));
            const newUnique = res.data.filter((p) => !existingIds.has(p.id_photo));
            return [...prev, ...newUnique];
          });
        } else if (res.status === 200) {
          setFetchNoMore(true); // Brak kolejnych zdjęć
        }
        setLoading(false);
        setPage(pageToFetch);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania zdjęć:", err);
        setLoading(false);
      });
  };

  // Pobieranie zdjęć z konkretnego katalogu
  const fetchPhotosFromCatalog = (pageToFetch = 0, sort = sortOrder, search = searchText) => {
    axios
      .get("/api/paged/getphotosincatalog", {
        params: { page: pageToFetch, sort, search, id_catalog: selectedCatalogId },
        headers: {Authorization: token },
      })
      .then((res) => {
        if (res.status === 201) {
          setSortedPhotos((prev) => {
            const existingIds = new Set(prev.map((p) => p.id_photo));
            const newUnique = res.data.filter((p) => !existingIds.has(p.id_photo));
            return [...prev, ...newUnique];
          });
        } else if (res.status === 200) {
          setFetchNoMore(true);
        }
        setLoading(false);
        setPage(pageToFetch);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania zdjęć:", err);
        setLoading(false);
      });
  };

  // Obsługa zmiany pól formularza “dodaj zdjęcie”
  const handleAddPhotoChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name === "is_private") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Obsługa dodania zdjęcia
  const addPhoto = (e, catalogList, closeModal) => {
    e.preventDefault();
    if (!formData.photo || formData.photo.type.split("/")[0] !== "image") {
      sendWarning("Niedozwolony typ pliku!");
      return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("is_private", formData.is_private);
    data.append("photo", formData.photo);
    data.append("catalogs_to_add", JSON.stringify(catalogList));

    axios
      .post("/api/addphoto", data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          sendError("Dodawanie zdjęcia nie powiodło się!");
        } else if (res.status === 201) {
          sendSuccess("Zdjęcie dodano pomyślnie!");
          closeModal();
          refr();
        } else {
          sendError("Dodawanie zdjęcia nie powiodło się!");
        }
      })
      .catch((err) => {
        console.error("Błąd przy dodawaniu zdjęcia:", err);
        sendError("Dodawanie zdjęcia nie powiodło się!");
      });
  };

  // Uzupełnienie formularza edycji istniejącym zdjęciem
  const prepareEditForm = (photo) => {
    setEditFormData({
      title: photo.title,
      description: photo.description,
      is_private: photo.is_private,
      id_photo: photo.id_photo,
    });
  };

  // Obsługa zmiany pól formularza “edytuj zdjęcie”
  const handleEditPhotoChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "is_private") {
      setEditFormData((prev) => ({
        ...prev,
        [name]: checked,
        id_photo: prev.id_photo,
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
        id_photo: prev.id_photo,
      }));
    }
  };

  // Obsługa edycji zdjęcia
  const editPhoto = (e, catalogList, closeModal) => {
    e.preventDefault();
    axios
      .patch(
        "/api/editphoto",
        { ...editFormData, catalogs_to_add: catalogList },
        {
          headers: {
           Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          sendError("Edycja zdjęcia nie powiodła się!");
        } else if (res.status === 201) {
          sendSuccess("Edycja zdjęcia zakończona pomyślnie!");
          closeModal();
          refr();
        } else {
          sendError("Photo edit failed.");
        }
      })
      .catch((err) => {
        console.error("Błąd edycji zdjęcia:", err);
        sendError("Edycja zdjęcia nie powiodła się!");
      });
  };

  // Usunięcie zdjęcia po potwierdzeniu
  const deletePhoto = (id) => {
    const confirmDelete = window.confirm("Na pewno chcesz usunąć to zdjęcie?");
    if (!confirmDelete) return;

    axios
      .delete("/api/deletephoto", {
        data: { id_photo: id },
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.status === 200) {
          sendError(res.data || "Usuwanie zdjęcia nie powiodło się!");
        } else {
          sendSuccess("Zdjęcie usunięte pomyślnie!");
          refr();
        }
      })
      .catch((err) => {
        console.error("Błąd usuwania zdjęcia:", err);
        sendError("Usuwanie zdjęcia nie powiodło się!");
      });
  };

  // Zmiana sortowania
  const handleSort = (e) => {
    setPage(0);
    setSortOrder(e.target.value);
  };

  // Obsługa pola wyszukiwania z opóźnieniem (debounce)
  const handleSearch = (e) => {
    const value = e.target.value;
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      setPage(0);
      setSearchText(value);
    }, 500);
  };

  return {
    sortedPhotos,
    searchText,
    handleSort,
    handleSearch,
    prepareEditForm,
    addPhoto,
    editPhoto,
    deletePhoto,
    handleAddPhotoChange,
    handleEditPhotoChange,
  };
}
