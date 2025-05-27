Galeria Zdjęć
Galeria Zdjęć to aplikacja webowa umożliwiająca użytkownikom zarządzanie i przeglądanie zdjęć online. Projekt został stworzony z użyciem React (frontend) oraz Express (backend), z wykorzystaniem PostgreSQL jako bazy danych.

Technologie
Frontend: React
Backend: Node.js + Express
Baza danych: PostgreSQL
Autoryzacja: JWT + weryfikacja e-mail
Przechowywanie zdjęć: lokalnie (filesystem)

Funkcjonalności
   Rejestracja i logowanie użytkownika
   Weryfikacja adresu e-mail przy rejestracji
   Zmiana hasła użytkownika
   Możliwość dodawania zdjęć
   Tworzenie katalogów i przypisywanie do nich zdjęć
   Edycja tytułu i opisu zdjęcia
   Publiczna galeria zdjęć
   Prywatna sekcja „Moje Zdjęcia”
   Możliwość usunięcia konta
   Podgląd zdjęcia w powiększeniu po kliknięciu
  
Zrzuty ekranu

Uruchamianie projektu lokalnie
1. Sklonuj repozytorium
  git clone https://github.com/ProjektPAW/ProjektPAW.git
  cd ProjektPAW
2. Zainstaluj pakiety Node
   npm install
3. Skonfiguruj plik .env
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
4. Uruchom aplikację
   npm start

Aplikacja dostępna na stronie internetowej: http://projektpaw.my.to/
