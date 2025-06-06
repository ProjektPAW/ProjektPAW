import { useState, useEffect } from "react";
import axios from "axios";

export default function useUser() {
  const [userData, setUserData] = useState({ username: "", email: "" });

  useEffect(() => {
    axios
      .get("/api/getuser", {
        headers: { Authorization: localStorage.getItem("jwtToken") },
      })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error("Błąd pobierania użytkownika:", err);
      });
  }, []);

  return { userData };
}