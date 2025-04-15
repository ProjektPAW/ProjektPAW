require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./controlers/auth");
const photos = require("./controlers/photos");
const fileUpload = require("express-fileupload");

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
app.use('/files',express.static('./files/'));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  auth.register(username, email, password,res);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  auth.login(username, password,res);
});

app.post("/checktoken", async (req, res) => {
  const token = req.headers.authorization;
  auth.checkTokenExpired(token,res);
});

app.get("/getuser", async (req, res) => {
  const token=req.headers.authorization;
  auth.getUser(token,res);
});

app.get("/getphotos", async (req, res) => {
  photos.getAllPublicPhotos(res);
});

app.get("/getuserphotos", async (req, res) => {
  const token=req.headers.authorization;
  photos.getUserPhotos(token, res);
});

app.post("/addphoto", async (req, res) => {
  const token=req.headers.authorization;
  photos.addPhoto(token,req,res);
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


