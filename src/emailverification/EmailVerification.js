import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {sendError, sendSuccess} from '../components/toast'
import axios from "axios";
import { AuthContext } from "../AuthContext";

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  //funkcja aktualizacji weryfikacji tokenu
  const { updateEmailVerified } = useContext(AuthContext);

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
          //aktualizacja statusu weryfikacji tokenu
          updateEmailVerified("true");
        }
        // Po 2 sekundach przekierowujemy na stronę główną
        setTimeout(() => navigate("/"), 2000);
      })
      .catch(() => {
        sendError("Weryfykacja adresu e-mail nie powiodła się!");
        setTimeout(() => navigate("/"), 2000);
      });
  }, []); // Efekt uruchamia się tylko raz po mountowaniu komponentu
  // Pusty div z wysokością by "zająć miejsce" podczas weryfikacji
  return ( 
    <div style={{height: 76 + 'vh'}}></div>
  );
}

export default EmailVerification;