import React, { createContext, useState, useEffect } from "react";
// Tworzenie kontekstu autoryzacji
export const AuthContext = createContext();

// Główny provider kontekstu
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // zawiera dane użytkownika
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Przy starcie aplikacji sprawdzamy localStorage pod kątem sesji użytkownika
  useEffect(() => {
    // Przy starcie aplikacji sprawdź localStorage
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const roleString = localStorage.getItem("role");
    const role =  parseInt(roleString, 10); // konwersja roli na liczbę
    const emailverified = localStorage.getItem("emailverified");

    // Jeśli token istnieje, ustawiamy użytkownika jako zalogowanego
    if (token) {
      setUser({ token, username, email, role, emailverified: emailverified === "true" });
      setIsLoggedIn(true);
    }
  }, []);

  // Funkcja logowania — zapisuje dane w localStorage i aktualizuje stan
  const login = (data) => {
    localStorage.setItem("jwtToken", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);
    localStorage.setItem("emailverified", data.emailverified);

    setUser(data);
    setIsLoggedIn(true);
  };
  // Funkcja wylogowania — czyści dane i resetuje stan
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
  };
  // Funkcja aktualizacji statusu weryfikacji e-maila
  const updateEmailVerified = (value) => {
  setUser(prevUser => {
    const updatedUser = { ...prevUser, emailverified: value };
    localStorage.setItem("emailverified", value);
    return updatedUser;
  });
};
  // Udostępnienie funkcji i danych w kontekście
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateEmailVerified  }}>
      {children}
    </AuthContext.Provider>
  );
}