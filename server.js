const express = require("express");
const cors = require("cors");

// Importation des routes
const paymentRoutes = require("./routes/payment.routes");
const authRoutes = require("./routes/auth.routes"); // <--- AJOUTE CETTE LIGNE

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Autorise le frontend à contacter le backend
app.use(express.json()); // Permet de lire les données JSON envoyées par fetch

// Utilisation des routes
app.use("/api", paymentRoutes); // Routes pour les commandes
app.use("/api", authRoutes);    // Routes pour le login et register

// Route de test
app.get("/", (req, res) => {
  res.send("Backend ICT Canteen OK ✅");
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});