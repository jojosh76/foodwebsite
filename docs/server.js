const express = require("express");
const cors = require("cors");

// Importation des routes
// Note : Assure-toi que payment.routes.js et auth.routes.js 
// contiennent bien les nouvelles routes pour les "meals" (plats)
const paymentRoutes = require("./routes/payment.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = 3000;

/* ===== MIDDLEWARES ===== */

// 1. Autorise le frontend (même sur des ports différents) à contacter le backend
app.use(cors()); 

// 2. Permet de lire les données JSON envoyées par fetch
// IMPORTANT : On augmente la limite à 50mb pour accepter les photos des plats en Base64
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* ===== UTILISATION DES ROUTES ===== */

// Toutes les routes de commandes, paiements, etc.
app.use("/api", paymentRoutes); 

// Toutes les routes de Login, Register, ET maintenant la gestion des PLATS (Meals)
app.use("/api", authRoutes); 

/* ===== ROUTES DE TEST ===== */

app.get("/", (req, res) => {
  res.send("Backend ICT Canteen OK ✅ - MySQL Connection Active");
});

/* ===== LANCEMENT DU SERVEUR ===== */

app.listen(PORT, () => {
  console.log("========================================");
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📸 Image Upload Limit: 50MB`);
  console.log("========================================");
});