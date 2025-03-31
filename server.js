require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const auth = require("./controlers/auth")

const app = express();
const PORT = process.env.PORT || 5000;

// Konfiguracja bazy danych
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());


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
  const { token } = req.body;
  auth.checkTokenExpired(token,res);
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


