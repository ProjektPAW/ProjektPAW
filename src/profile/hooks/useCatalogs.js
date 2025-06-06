// src/profile/hooks/useCatalogs.js
import { useState, useEffect } from "react";
import axios from "axios";
import { sendError, sendSuccess, sendWarning } from "../../toast";

export default function useCatalogs(refr) {
  /** GLOBAL CATALOG STATE (all catalogs) **/
  const [catalogs, setCatalogs] = useState([]);

  /** PER-PHOTO CATALOG STATE **/
  const [catalogList, setCatalogList] = useState({});
  const [checkedCatalogsList, setCheckedCatalogsList] = useState([]);
  const [catalogsLoaded, setCatalogsLoaded] = useState(false);

  /** MODAL FLAGS **/
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showEditCatalogModal, setShowEditCatalogModal] = useState(false);

  /** SELECTED CATALOG FOR “FILTER” OR “EDIT” **/
  const [selectedCatalogId, setSelectedCatalogId] = useState(-1);

  /** NEW‐CATALOG FORM STATE **/
  const [newCatalog, setNewCatalog] = useState({ name: "" });
  const [newCatalogName, setNewCatalogName] = useState("");

  useEffect(() => {
    const allOption = { id_catalog: -1, name: "All", id_user: null };
    axios
      .get("/api/getusercatalogs", {
        headers: { Authorization: localStorage.getItem("jwtToken") },
      })
      .then((res) => {
        setCatalogs([allOption, ...res.data]);
      })
      .catch((err) => {
        console.error("Błąd pobierania folderów:", err);
      });
  }, []);

  const handleCatalogChange = (e) => {
    const { name, value } = e.target;
    setNewCatalog((prev) => ({ ...prev, [name]: value }));
  };

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
        headers: { Authorization: localStorage.getItem("jwtToken") },
      })
      .then((res) => {
        if (res.status === 200) {
          sendError("Dodawanie katalogu nie powiodło się!");
        } else {
          sendSuccess("Katalog dodany pomyślnie!");
          setShowCatalogModal(false);
          refr();
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
        { headers: { Authorization: localStorage.getItem("jwtToken") } }
      )
      .then(() => {
        sendSuccess("Katalog został zaktualizowany!");
        setShowEditCatalogModal(false);
        refr();
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
        headers: { Authorization: localStorage.getItem("jwtToken") },
        data: { id_catalog: selectedCatalogId },
      })
      .then(() => {
        sendSuccess("Katalog został usunięty.");
        setShowEditCatalogModal(false);
        refr();
      })
      .catch((err) => {
        console.error("Błąd usuwania katalogu:", err);
        sendError("Usunięcie katalogu nie powiodło się.");
      });
  };

  const loadPhotoCatalogs = (photoId) => {
    setCatalogList({});
    setCheckedCatalogsList([]);
    setCatalogsLoaded(false);

    axios
      .get("/api/getphotocatalogs", {
        params: { id_photo: photoId },
        headers: { Authorization: localStorage.getItem("jwtToken") },
      })
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        const tempIds = arr.map((c) => c.id_catalog);
        const catalogObj = tempIds.reduce((acc, idC) => {
          acc[idC] = true;
          return acc;
        }, {});

        setCatalogList(catalogObj);
        setCheckedCatalogsList(tempIds);
        setCatalogsLoaded(true);
      })
      .catch((err) => {
        console.error("Błąd pobierania katalogów zdjęcia:", err);
        setCatalogsLoaded(true);
      });
  };

  return {
    // GLOBAL
    catalogs,

    // PER-PHOTO
    catalogList,
    setCatalogList,
    checkedCatalogsList,
    catalogsLoaded,
    loadPhotoCatalogs,

    // MODALS
    showCatalogModal,
    setShowCatalogModal,
    showEditCatalogModal,
    setShowEditCatalogModal,

    // FILTER / EDIT ID
    selectedCatalogId,
    setSelectedCatalogId,

    // NEW CATALOG
    newCatalog,
    handleCatalogChange,
    createCatalog,

    // EDIT CATALOG
    newCatalogName,
    setNewCatalogName,
    editCatalog,
    deleteCatalog,

    // CHECKBOX HANDLER FOR ADD/EDIT PHOTO
    handleSetCatalogs,
  };
}
