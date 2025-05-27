# 📸 Galeria Zdjęć
Galeria Zdjęć to aplikacja webowa umożliwiająca użytkownikom zarządzanie oraz przeglądanie zdjęć online. Projekt został zrealizowany <br> w oparciu o React (frontend), Node.js + Express (backend) oraz PostgreSQL jako bazę danych.

## 🛠 Technologie

-   Frontend: React
-   Backend: Node.js + Express
-   Baza danych: PostgreSQL
-   Autoryzacja: JWT + weryfikacja e-mail
-   Przechowywanie zdjęć: lokalny system plików

## ✨ Funkcjonalności

 -  🔐 Rejestracja i logowanie użytkownika
 -  ✅ Weryfikacja adresu e-mail
 -  🔑 Zmiana hasła
 -  🖼 Możliwość dodawania zdjęć
 -  📁 Tworzenie katalogów oraz przypisywanie do nich zdjęć
 -  ✏️ Edycja tytułu i opisu zdjęcia
 -  🌐 Publiczna galeria zdjęć
 -  🔒 Możliwość dodawnia zdjęć jako prywatne
 -  ❌ Możliwość usunięcia konta
 -  🔍 Powiększanie zdjęcia po kliknięciu

## Uruchamianie lokalnie
   Wymagane jest zainstalowanie managera pakietów node np. npm
   
1. Sklonuj repozytorium
   ``` bash 
      git clone https://github.com/ProjektPAW/ProjektPAW.git
      cd ProjektPAW  
   ```

3. Zainstaluj zależności <br>
   ``` bash
      npm install
   ```
   
5. Skonfiguruj plik .env <br>
   Utwórz plik .env w katalogu głównym i uzupełnij go np. tak: <br>
   ``` .env
      DB_HOST="localhost" 
      DB_USER="postgres" 
      DB_PASSWORD="db_password" 
      DB_PORT=5432 
      DB_DATABASE="Galeria" 
      VERIFICATION_EMAIL="email@example.com" 
      VERIFICATION_EMAIL_PASSWORD="password"
      HASHING_SECRET=0 
      JWT_SECRET="secret" 
      SERVER_ADDRESS="http://localhost:5000/"
   ```

   
4. Uruchom aplikację
   ```
      npm start
   ```
   
### Domyślnie aplikacja będzie dostępna pod adresem: http://localhost:5000

## 🌐 Aplikacja online

Dostępna wersja aplikacji: http://projektpaw.my.to/
