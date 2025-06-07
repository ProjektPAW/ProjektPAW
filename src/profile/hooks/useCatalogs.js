import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { sendError, sendSuccess, sendWarning } from "../../components/toast";
import { AuthContext } from "../../AuthContext";  // import AuthContext

export default function useCatalogs(refr) {
  //pobranie danych z authcontext
  const { user } = useContext(AuthContext);
  const token = user?.token;
  // Stan do listy katalogów
  const [catalogs, setCatalogs] = useState([]);

  const [catalogList, setCatalogList] = useState({}); // obiekt {[id_catalog]: true}
  const [checkedCatalogsList, setCheckedCatalogsList] = useState([]); // tylko ID
  const [catalogsLoaded, setCatalogsLoaded] = useState(false);

  // Stany modali
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showEditCatalogModal, setShowEditCatalogModal] = useState(false);

  // Katalog wybrany do edycji
  const [selectedCatalogId, setSelectedCatalogId] = useState(-1);

  // Stany do dodawania katalogów
  const [newCatalog, setNewCatalog] = useState({ name: "" });
  const [newCatalogName, setNewCatalogName] = useState("");

  // Pobierz katalogi użytkownika
  useEffect(() => {
    const allOption = { id_catalog: -1, name: "All", id_user: null };
    axios
      .get("/api/getusercatalogs", {
        headers: { Authorization: token  },
      })
      .then((res) => {
        setCatalogs([allOption, ...res.data]); // Dodaje "All" jako uniwersalną opcję
      })
      .catch((err) => {
        console.error("Błąd pobierania folderów:", err);
      });
  }, []);

  const handleCatalogChange = (e) => {
    const { name, value } = e.target;
    setNewCatalog((prev) => ({ ...prev, [name]: value }));
  };

  // Obsługa checkboxów dla katalogów zdjęcia
  const handleSetCatalogs = (e) => {
    const { name, checked } = e.target;
    setCatalogList((prev) => ({ ...prev, [name]: checked }));
  };

  const createCatalog = () => {
    if (!newCatalog.name || newCatalog.name.includes(" ")) {
      sendWarning("Niepoprawna nazwa katalogu!");
      return;
    }
    axios
      .post("/api/addcatalog", newCatalog, {
        headers: { Authorization: token  },
      })
      .then((res) => {
        if (res.status === 200) {
          sendError("Dodawanie katalogu nie powiodło się!");
        } else {
          sendSuccess("Katalog dodany pomyślnie!");
          setShowCatalogModal(false);
          refr(); // Odświeżenie katalogów
        }
      })
      .catch((err) => {
        console.error("Błąd podczas dodawania katalogu:", err);
        sendError("Dodawanie katalogu nie powiodło się!");
      });
  };

  const editCatalog = (e) => {
    e.preventDefault();
    if (!selectedCatalogId || newCatalogName.includes(" ")) {
      sendError("Niepoprawna nazwa katalogu!");
      return;
    }
    if (newCatalogName === "") {
      sendError("Nowa nazwa katalogu jest taka sama jak poprzednia");
      return;
    }
    axios
      .patch(
        "/api/editcatalog",
        { id_catalog: selectedCatalogId, name: newCatalogName },
        { headers: { Authorization: token  } }
      )
      .then(() => {
        sendSuccess("Katalog został zaktualizowany!");
        setShowEditCatalogModal(false);
        refr(); // Odświeżenie po edycji
      })
      .catch((err) => {
        console.error("Błąd edycji katalogu:", err);
        sendError("Edycja katalogu nie powiodła się.");
      });
  };

  const deleteCatalog = () => {
    if (!selectedCatalogId) {
      sendWarning("Nie wybrano katalogu.");
      return;
    }
    const confirmDelete = window.confirm("Na pewno chcesz usunąć ten katalog?");
    if (!confirmDelete) return;

    axios
      .delete("/api/deletecatalog", {
        headers: { Authorization: token  },
        data: { id_catalog: selectedCatalogId },
      })
      .then(() => {
        sendSuccess("Katalog został usunięty.");
        setShowEditCatalogModal(false);
        refr(); // Aktualizacja listy po usunięciu
      })
      .catch((err) => {
        console.error("Błąd usuwania katalogu:", err);
        sendError("Usunięcie katalogu nie powiodło się.");
      });
  };

  // Ładuje listę katalogów przypisanych do zdjęcia
  const loadPhotoCatalogs = (photoId) => {
    setCatalogList({});
    setCheckedCatalogsList([]);
    setCatalogsLoaded(false);

    axios
      .get("/api/getphotocatalogs", {
        params: { id_photo: photoId },
        headers: { Authorization: token  },
      })
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        const tempIds = arr.map((c) => c.id_catalog);
        const catalogObj = tempIds.reduce((acc, idC) => {
          acc[idC] = true;
          return acc;
        }, {});

        setCatalogList(catalogObj); // np. {2: true, 5: true}
        setCheckedCatalogsList(tempIds); // np. [2, 5]
        setCatalogsLoaded(true);
      })
      .catch((err) => {
        console.error("Błąd pobierania katalogów zdjęcia:", err);
        setCatalogsLoaded(true);
      });
  };

  return {
    catalogs,
    catalogList,
    setCatalogList,
    checkedCatalogsList,
    catalogsLoaded,
    loadPhotoCatalogs,
    showCatalogModal,
    setShowCatalogModal,
    showEditCatalogModal,
    setShowEditCatalogModal,
    selectedCatalogId,
    setSelectedCatalogId,
    newCatalog,
    handleCatalogChange,
    createCatalog,
    newCatalogName,
    setNewCatalogName,
    editCatalog,
    deleteCatalog,
    handleSetCatalogs,
  };
}
