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

router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  auth.register(username, email, password,res);
});
router.post("/verify-email", async (req, res) => {
  const { emailToken } = req.body;
  auth.verifyEmail(emailToken,res);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  auth.login(username, password,res);
});

router.post("/checktoken", async (req, res) => {
  const token = req.headers.authorization;
  auth.checkTokenExpired(token,res);
});

router.get("/getuser", async (req, res) => {
  const token=req.headers.authorization;
  auth.getUser(token,res);
});

router.get("/getphotos", async (req, res) => {
  photos.getAllPublicPhotos(res);
});

router.get("/paged/getphotos", async (req, res) => {
  photos.filterGetAllPublicPhotos(req, res);
});

router.get("/getuserphotos", async (req, res) => {
  const token=req.headers.authorization;
  photos.getUserPhotos(token, res);
});

router.get("/paged/getuserphotos", async (req, res) => {
  const token=req.headers.authorization;
  photos.filterGetUserPhotos(token, req, res);
});

router.post("/addphoto", async (req, res) => {
  const token=req.headers.authorization;
  photos.addPhoto(token,req,res);
});

router.patch("/editphoto", async (req, res) => {
  const token=req.headers.authorization;
  photos.editPhoto(token,req,res);
});

router.delete("/deletephoto", async (req, res) => {
  const token=req.headers.authorization;
  photos.deletePhoto(token,req,res);
});
router.delete("/deletephotobyadmin", async (req, res) => {
  const token=req.headers.authorization;
  photos.deletePhoto(token,req,res);
});

// CATALOGS
router.get("/getusercatalogs", async (req, res) => {
  const token=req.headers.authorization;
  catalogs.getUserCatalogs(token,res);
});

router.get("/getphotocatalogs", async (req, res) => {
  const token=req.headers.authorization;
  catalogphoto.getPhotoCatalogs(token,req,res);
});

router.post("/addcatalog", async (req, res) => {
  const token=req.headers.authorization;
  catalogs.addCatalog(token,req,res);
});

router.patch("/editcatalog", async (req, res) => {
  const token=req.headers.authorization;
  catalogs.editCatalog(token,req,res);
});

router.delete("/deletecatalog", async (req, res) => {
  const token=req.headers.authorization;
  catalogs.deleteCatalog(token,req,res);
});

// PHOTOS IN CATALOGS
router.get("/getphotosincatalog", async (req, res) => {
  const token=req.headers.authorization;
  catalogphoto.getPhotosInCatalog(token,req,res);
});

router.get("/paged/getphotosincatalog", async (req, res) => {
  const token=req.headers.authorization;
  catalogphoto.filterGetPhotosInCatalog(token,req,res);
});

router.post("/addphototocatalog", async (req, res) => {
  const token=req.headers.authorization;
  catalogphoto.addPhotoToCatalog(token,req,res);
});


// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


