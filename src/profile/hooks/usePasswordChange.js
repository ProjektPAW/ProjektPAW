import { useState } from "react";
import axios from "axios";
import { sendError, sendSuccess } from '../../toast'

export default function usePasswordChange(refr, closeModal) {
  const [changePasswordFormData, setChangePasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setChangePasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
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
          closeModal();
          refr();
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
