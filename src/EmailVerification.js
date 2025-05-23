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
          sendError("Email verification failed.");
        else if (response.status === 201){
          sendSuccess("Email verified successfully!");
          localStorage.setItem("emailverified","true");
        }
        navigate("/");
      })
      .catch(() => {
        sendError("Email verification failed.");
        navigate("/");
      });
  }, []);
  return (
    <div style={{height: 76 + 'vh'}}></div>
  );
}

export default EmailVerification;