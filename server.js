require("dotenv").config();
const express = require("express");
const auth = require("./controlers/auth");
const photos = require("./controlers/photos");
const catalogs = require("./controlers/catalogs");
const catalogphoto = require("./controlers/catalogPhoto");
const fileUpload = require("express-fileupload");
const router = express.Router();
const path = require('path');

// Inicjalizacja aplikacji Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware do obsługi żądań JSON
app.use(express.json());
// Middleware do obsługi uploadu plików
app.use(fileUpload({
    // Maksymalny rozmiar przesyłanego pliku – 10 MB
    limits: { fileSize: 10 * 1024 * 1024 },

    // Ustawienie na zapisywanie plików tymczasowo na dysku zamiast w pamięci
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
// Serwowanie statycznych plików z katalogu "files" pod endpointem /api/files
app.use('/api/files',express.static('./files/'));
// Główna ścieżka API – przekierowuje wszystkie pozostałe endpointy do routera
app.use('/api', router);

// Serwowanie zbudowanego frontendu
app.use(express.static(path.join(__dirname, 'build')));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// AUTH – Obsługa użytkowników i autoryzacji

// Rejestracja nowego użytkownika
router.post("/register", async (req, res) => {
  auth.register(req,res);
});

// Usuwanie konta użytkownika
router.delete("/deleteuser", async (req, res) => {
  auth.deleteuser(req,res);
});

// Zmiana hasła użytkownika
router.patch("/changepassword", async (req, res) => {
  auth.changepassword(req,res);
});

// Weryfikacja adresu e-mail (po kliknięciu w link aktywacyjny)
router.post("/verify-email", async (req, res) => {
  auth.verifyEmail(req,res);
});

// Logowanie użytkownika
router.post("/login", async (req, res) => {
  auth.login(req,res);
});

// Odświeżenie tokenu JWT
router.post("/refreshtoken", async (req, res) => {
  auth.refreshToken(req,res);
});

// Pobranie danych o aktualnie zalogowanym użytkowniku
router.get("/getuser", async (req, res) => {
  auth.getUser(req,res);
});

// PHOTOS – Obsługa zdjęć

// Pobranie najnowszych 5 zdjęć publicznych do karuzeli (slidera)
router.get("/getcarouselphotos", async (req, res) => {
  photos.getCarouselPhotos(res);
});

// Paginacja publicznych zdjęć z sortowaniem i wyszukiwaniem
router.get("/paged/getphotos", async (req, res) => {
  photos.filterGetAllPublicPhotos(req, res);
});

// Paginacja zdjęć użytkownia z sortowaniem i wyszukiwaniem
router.get("/paged/getuserphotos", async (req, res) => {
  photos.filterGetUserPhotos( req, res);
});

// Dodawanie nowego zdjęcia
router.post("/addphoto", async (req, res) => {
  photos.addPhoto(req,res);
});

// Edycja danych zdjęcia (tytuł, opis, prywatność, katalogi)
router.patch("/editphoto", async (req, res) => {
  photos.editPhoto(req,res);
});

// Usuwanie zdjęcia przez użytkownika lub administratora
router.delete("/deletephoto", async (req, res) => {
  photos.deletePhoto(req,res);
});

// CATALOGS – Obsługa katalogów (albumów) użytkownika

// Pobranie listy katalogów użytkownika
router.get("/getusercatalogs", async (req, res) => {
  catalogs.getUserCatalogs(req,res);
});

// Dodanie nowego katalogu
router.post("/addcatalog", async (req, res) => {
  catalogs.addCatalog(req,res);
});

// Edycja katalogu, zmiana nazwy
router.patch("/editcatalog", async (req, res) => {
  catalogs.editCatalog(req,res);
});

// Usunięcie katalogu użytkownika
router.delete("/deletecatalog", async (req, res) => {
  catalogs.deleteCatalog(req,res);
});

// PHOTOS IN CATALOGS – Obsługa przypisania zdjęć do katalogów

// Pobranie listy katalogów, w których znajduje się zdjęcie
router.get("/getphotocatalogs", async (req, res) => {
  catalogphoto.getPhotoCatalogs(req,res);
});

// Paginacja zdjęć w konkretnym katalogu użytkownika
router.get("/paged/getphotosincatalog", async (req, res) => {
  catalogphoto.filterGetPhotosInCatalog(req,res);
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
