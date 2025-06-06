import { useState, useEffect } from "react";
import axios from "axios";

// Hook do pobierania i przechowywania danych użytkownika
export default function useUser() {
  // Stan na dane użytkownika (username i email)
  const [userData, setUserData] = useState({ username: "", email: "" });

  // Efekt uruchamiany raz przy montowaniu komponentu
  useEffect(() => {
    // Pobranie danych użytkownika z API z autoryzacją JWT
    axios
      .get("/api/getuser", {
        headers: { Authorization: localStorage.getItem("jwtToken") },
      })
      .then((res) => {
        setUserData(res.data); // ustawienie pobranych danych w stanie
      })
      .catch((err) => {
        console.error("Błąd pobierania użytkownika:", err);
      });
  }, []); // pusty array – efekt uruchamia się tylko raz

  return { userData }; // Zwracamy dane użytkownika do komponentu korzystającego z hooka
}