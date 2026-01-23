const express = require("express");
const cors = require("cors");

// Importation des routes (Chemin configuré pour /backend/routes/)
const paymentRoutes = require("./routes/payment.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
// Render utilise dynamiquement la variable PORT
const PORT = process.env.PORT || 3000;

/* ===== MIDDLEWARES ===== */

// 1. Autorise le frontend à contacter le backend
app.use(cors()); 

// 2. Lecture des données JSON
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* ===== UTILISATION DES ROUTES ===== */

app.use("/api", paymentRoutes); 
app.use("/api", authRoutes); 

/* ===== ROUTES DE TEST ===== */

app.get("/", (req, res) => {
  res.send("Backend ICT Canteen OK ✅ - Render Active");
});

/* ===== LANCEMENT DU SERVEUR ===== */

// Sur Render, on n'utilise pas d'IP fixe, le serveur écoute sur toutes les interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log("========================================");
    console.log(`🚀 Serveur actif sur le port : ${PORT}`);
    console.log("========================================");
});