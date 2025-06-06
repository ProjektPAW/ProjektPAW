require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./controlers/auth");
const photos = require("./controlers/photos");
const catalogs = require("./controlers/catalogs");
const catalogphoto = require("./controlers/catalogPhoto");
const fileUpload = require("express-fileupload");
const router = express.Router()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    // Configure file uploads with maximum file size 10MB
    limits: { fileSize: 10 * 1024 * 1024 },

    // Temporarily store uploaded files to disk, rather than buffering in memory
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use('/api/files',express.static('./files/'));
app.use('/api', router);

router.get("/", (req, res) => {
  res.send("API is running...");
});

router.post("/register", async (req, res) => {
  auth.register(req,res);
});

router.delete("/deleteuser", async (req, res) => {
  auth.deleteuser(req,res);
});

router.patch("/changepassword", async (req, res) => {
  auth.changepassword(req,res);
});

router.post("/verify-email", async (req, res) => {
  auth.verifyEmail(req,res);
});

router.post("/login", async (req, res) => {
  auth.login(req,res);
});

router.post("/refreshtoken", async (req, res) => {
  auth.refreshToken(req,res);
});

router.get("/getuser", async (req, res) => {
  auth.getUser(req,res);
});

router.get("/getcarouselphotos", async (req, res) => {
  photos.getCarouselPhotos(res);
});

router.get("/paged/getphotos", async (req, res) => {
  photos.filterGetAllPublicPhotos(req, res);
});

router.get("/paged/getuserphotos", async (req, res) => {
  photos.filterGetUserPhotos( req, res);
});

router.post("/addphoto", async (req, res) => {
  photos.addPhoto(req,res);
});

router.patch("/editphoto", async (req, res) => {
  photos.editPhoto(req,res);
});

router.delete("/deletephoto", async (req, res) => {
  photos.deletePhoto(req,res);
});

// CATALOGS
router.get("/getusercatalogs", async (req, res) => {
  catalogs.getUserCatalogs(req,res);
});

router.post("/addcatalog", async (req, res) => {
  catalogs.addCatalog(req,res);
});

router.patch("/editcatalog", async (req, res) => {
  catalogs.editCatalog(req,res);
});

router.delete("/deletecatalog", async (req, res) => {
  catalogs.deleteCatalog(req,res);
});

// PHOTOS IN CATALOGS
router.get("/getphotocatalogs", async (req, res) => {
  catalogphoto.getPhotoCatalogs(req,res);
});

router.get("/paged/getphotosincatalog", async (req, res) => {
  catalogphoto.filterGetPhotosInCatalog(req,res);
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


