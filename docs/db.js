const mysql = require("mysql2");

// Utilise les variables d'environnement ou les valeurs par défaut (pour le local)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Jojo@inator26",
  database: process.env.DB_DATABASE || "canteen_web_db",
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.log("❌ MySQL error:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});

module.exports = db;