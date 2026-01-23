const mysql = require('mysql2');

// On crée la connexion en utilisant les variables de Render
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  // Indispensable pour la connexion sécurisée entre Render et Railway
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à Railway :", err.message);
    return;
  }
  console.log("✅ Connecté avec succès à la base de données Railway !");
});

module.exports = db;