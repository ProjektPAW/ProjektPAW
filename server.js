require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

// Konfiguracja bazy danych
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pawdb",
  password: "admin",
  port: 5432,
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

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});