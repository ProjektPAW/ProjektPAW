import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {sendError, sendSuccess} from './toast'
import axios from "axios";

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const emailToken = searchParams.get("token");
    if (!emailToken) {
      return;
    }
    axios
      .post("/api/verify-email", { emailToken })
      .then((response) =>{ 
        if (response.status === 200)
          sendError("Weryfykacja adresu e-mail nie powiodła się!");
        else if (response.status === 201){
          sendSuccess("Weryfikacja adresu e-mail zakończona powodzeniem!");
          localStorage.setItem("emailverified","true");
        }
        // Po 2 sekundach przekierowujemy na stronę główną
        setTimeout(() => window.location.href="/", 2000);
      })
      .catch(() => {
        sendError("Weryfykacja adresu e-mail nie powiodła się!");
        setTimeout(() => window.location.href="/", 2000);
      });
  }, []); // Efekt uruchamia się tylko raz po mountowaniu komponentu
  // Pusty div z wysokością by "zająć miejsce" podczas weryfikacji
  return ( 
    <div style={{height: 76 + 'vh'}}></div>
  );
}

export default EmailVerification;