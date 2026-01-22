const express = require("express");
const cors = require("cors");

// Importation des routes
const paymentRoutes = require("./routes/payment.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = 3000;

/* ===== MIDDLEWARES ===== */

// 1. Autorise le frontend à contacter le backend
app.use(cors()); 

// 2. Lecture des données JSON (Limite augmentée pour les images Base64)
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* ===== UTILISATION DES ROUTES ===== */

app.use("/api", paymentRoutes); 
app.use("/api", authRoutes); 

/* ===== ROUTES DE TEST ===== */

app.get("/", (req, res) => {
  res.send("Backend ICT Canteen OK ✅ - MySQL Connection Active");
});

/* ===== LANCEMENT DU SERVEUR ===== */

// On utilise '0.0.0.0' pour accepter les connexions du PC ET du téléphone (réseau local)
app.listen(PORT, '0.0.0.0', () => {
    console.log("========================================");
    console.log(`🚀 Serveur actif sur : http://localhost:${PORT}`);
    console.log(`📱 Accessible sur le réseau à : http://10.117.226.154:${PORT}`);
    console.log(`📸 Image Upload Limit: 50MB`);
    console.log("========================================");
});