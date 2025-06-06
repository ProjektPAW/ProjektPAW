import axios from "axios";
import {sendError, sendSuccess} from '../../toast'

export default function useUserAccount() {
  const deleteUser = () => {
    const confirmDelete = window.confirm("Na pewno chcesz usunąć konto?");
    if (!confirmDelete) return;

    axios
      .delete("/api/deleteuser", {
        headers: { Authorization: localStorage.getItem("jwtToken") },
      })
      .then((res) => {
        if (res.status === 200) {
          sendError(res.data || "Usuwanie konta nie powiodło się!");
        } else {
          sendSuccess("Konto usunięte pomyślnie!");
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("username");
          localStorage.removeItem("email");
          localStorage.removeItem("role");
          localStorage.removeItem("emailverified");
          setTimeout(() => (window.location.href = "/"), 2000);
        }
      })
      .catch((err) => {
        console.error("Błąd podczas usuwania konta:", err);
        sendError("Usuwanie konta nie powiodło się!");
      });
  };

  return { deleteUser };
}