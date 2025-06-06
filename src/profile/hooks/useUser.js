import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

// Hook do pobierania i przechowywania danych użytkownika
export default function useUser() {
  //pobranie danych z authcontext
  const { user } = useContext(AuthContext);
  const token = user?.token;
  // Stan na dane użytkownika (username i email)
  const [userData, setUserData] = useState({ username: "", email: "" });

  // Efekt uruchamiany raz przy montowaniu komponentu
  useEffect(() => {
    // Pobranie danych użytkownika z API z autoryzacją JWT
    axios
      .get("/api/getuser", {
         headers: { Authorization: token },
      })
      .then((res) => {
        setUserData(res.data); // ustawienie pobranych danych w stanie
      })
      .catch((err) => {
        console.error("Błąd pobierania użytkownika:", err);
      });
  }, [token]);

  return { userData }; // Zwracamy dane użytkownika do komponentu korzystającego z hooka
}