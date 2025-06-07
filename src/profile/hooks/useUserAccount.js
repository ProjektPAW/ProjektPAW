import axios from "axios";
import { useContext } from "react";
import {sendError, sendSuccess} from '../../components/toast'
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

// Hook do obsługi akcji na koncie użytkownika (np. usuwanie konta)
export default function useUserAccount() {
  //pobranie danych użytkownika z authcontext
  const { user, logout } = useContext(AuthContext);
  const token = user?.token;
  const navigate = useNavigate();
  // Funkcja do usuwania konta użytkownika
  const deleteUser = () => {
    // Potwierdzenie akcji przez użytkownika
    const confirmDelete = window.confirm("Na pewno chcesz usunąć konto?");
    if (!confirmDelete) return; // jeśli anulował, przerwij

    // Wysłanie żądania DELETE do API z nagłówkiem autoryzacji
    axios
      .delete("/api/deleteuser", {
        headers: { Authorization: token },
      })
      .then((res) => {
        // Jeśli status 200, to błąd
        if (res.status === 200) {
          sendError(res.data || "Usuwanie konta nie powiodło się!");
        } else {
          // Inaczej sukces - powiadom użytkownika i wyczyść localStorage
          sendSuccess("Konto usunięte pomyślnie!");
          logout(); // wylogowanie i wyczyszczenie danych użytkownika

          // Po 2 sekundach przekieruj na stronę główną
          setTimeout(() => {navigate("/");}, 2000);
        }
      })
      .catch((err) => {
        // Obsługa błędu z żądania
        console.error("Błąd podczas usuwania konta:", err);
        sendError("Usuwanie konta nie powiodło się!");
      });
  };

  // Zwracamy funkcję do użycia w komponencie
  return { deleteUser };
}