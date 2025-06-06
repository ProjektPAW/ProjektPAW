import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { sendError, sendSuccess} from "../toast";

export default function usePublicPhotos(refr) {
  // ————— CAROUSEL STATE —————
  const [carouselPhotos, setCarouselPhotos] = useState([]);

  // ————— PUBLIC GRID STATE —————
  const [sortedPhotos, setSortedPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("added_desc");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); // zapobiega wielokrotnemu fetchowaniu
  const [fetchNoMore, setFetchNoMore] = useState(false); // oznacza, że nie ma więcej danych

  const debounceTimeoutRef = useRef(null); // do opóźniania wyszukiwania (debounce)

  // pobiera zdjęcia do karuzeli (na start)
  useEffect(() => {
    axios
      .get("/api/getcarouselphotos")
      .then((res) => setCarouselPhotos(res.data))
      .catch((err) => console.error("Błąd podczas pobierania carousel:", err));
  }, []);

  // przy zmianie sortowania lub wyszukiwania resetuje dane i pobiera od początku
  useEffect(() => {
    setSortedPhotos([]);
    setPage(0);
    setFetchNoMore(false);
    fetchPhotos(0, sortOrder, searchText);
  }, [sortOrder, searchText]);

  // nieskończone przewijanie: jeśli użytkownik blisko końca strony, pobierz kolejne zdjęcia
  const handleScroll = () => {
    if (fetchNoMore || loading) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight - scrollTop < 200) {
      setLoading(true);
      fetchPhotos(page + 1, sortOrder, searchText);
    }
  };

  // rejestruje i usuwa listener przewijania
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, fetchNoMore, sortOrder, searchText]);

  // pobiera zdjęcia z backendu z paginacją i filtrami
  const fetchPhotos = (pageToFetch = 0, sort = sortOrder, search = searchText) => {
    axios
      .get("/api/paged/getphotos", {
        params: { page: pageToFetch, sort, search },
      })
      .then((res) => {
        if (res.status === 201) {
          // dodaje tylko nowe zdjęcia (unika duplikatów)
          setSortedPhotos((prev) => {
            const existingIds = new Set(prev.map((p) => p.id_photo));
            const newUnique = res.data.filter((p) => !existingIds.has(p.id_photo));
            return [...prev, ...newUnique];
          });
        } else if (res.status === 200) {
          // brak kolejnych danych
          setFetchNoMore(true);
        } else {
          console.warn("Błąd przy pobieraniu zdjęć:", res.data?.message);
        }
        setLoading(false);
        setPage(pageToFetch);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania zdjęć:", err);
        setLoading(false);
      });
  };

  // usuwa zdjęcie po potwierdzeniu; odświeża dane po udanym usunięciu
  const deletePhoto = (id) => {
    const confirmDelete = window.confirm("Na pewno chcesz usunąć to zdjęcie?");
    if (!confirmDelete) return;

    axios
        .delete("/api/deletephoto", {
        data: { id_photo: id },
        headers: { Authorization: localStorage.getItem("jwtToken") },
        })
        .then((res) => {
        if (res.status === 200) {
            sendError(res.data || "Usuwanie nie powiodło się.");
        } else {
            sendSuccess("Zdjęcie usunięte pomyślnie!");
            refr(); // odświeżenie listy zdjęć z zewnątrz
        }
        })
        .catch((err) => {
        console.error("Błąd usuwania zdjęcia:", err);
        sendError("Usuwanie nie powiodło się.");
        });
    };

  // zmienia aktualne sortowanie
  const handleSort = (e) => {
    setPage(0);
    setSortOrder(e.target.value);
  };
  
  // debounced: zmienia tekst wyszukiwania po 500ms bez pisania
  const handleSearch = (e) => {
    const value = e.target.value;
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      setPage(0);
      setSearchText(value);
    }, 500);
  };

  return {
    carouselPhotos,
    sortedPhotos,
    sortOrder,
    searchText,
    handleSort,
    handleSearch,
    deletePhoto,
    loading,
    fetchNoMore,
  };
}
