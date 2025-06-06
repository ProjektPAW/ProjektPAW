import { useState } from "react";
import axios from "axios";
import { sendError, sendSuccess } from '../../toast'

export default function usePasswordChange(refr, closeModal) {
  // Stan formularza zmiany hasła
  const [changePasswordFormData, setChangePasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });

  // Obsługa wpisywania danych do formularza
  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setChangePasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Obsługa przesyłania formularza
  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    // Walidacja: sprawdź, czy nowe hasła się zgadzają
    if (
      changePasswordFormData.newPassword !==
      changePasswordFormData.confirmedNewPassword
    ) {
      sendError("Hasła muszą się zgadzać");
      return;
    }
    axios
      .patch(
        "/api/changepassword",
        {
          currentPassword: changePasswordFormData.oldPassword,
          newPassword: changePasswordFormData.newPassword,
        },
        {
          headers: { Authorization: localStorage.getItem("jwtToken") },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          sendError("Niepoprawne hasło!");
        } else if (res.status === 201) {
          sendSuccess("Zmiana hasła zakończona sukcesem!");
          closeModal(); // Zamknij modal
          refr(); // Odśwież widok
        } else {
          sendError("Zmiana hasła nie powiodła się!");
        }
      })
      .catch((err) => {
        console.error("Błąd zmiany hasła:", err);
        sendError("Zmiana hasła nie powiodła się!");
      });
  };

  return {
    changePasswordFormData,
    handleChangePassword,
    handleSubmitChangePassword,
  };
}
