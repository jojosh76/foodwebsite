const express = require("express");
const router = express.Router();
const db = require("../db");

// ==========================================
// 1. AUTHENTIFICATION (LOGIN & REGISTER)
// ==========================================
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur base de données" });
        if (results.length > 0) {
            res.json({ success: true, user: { id: results[0].id, name: results[0].name, email: results[0].email } });
        } else {
            res.status(401).json({ success: false, message: "Email ou mot de passe invalide" });
        }
    });
});

router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur : Email déjà utilisé" });
        res.json({ success: true, message: "Compte créé avec succès", userId: result.insertId });
    });
});

// ==========================================
// 2. GESTION DES PLATS (MEALS) - SQL
// ==========================================

router.get("/meals", (req, res) => {
    const sql = "SELECT * FROM meals ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur lecture meals" });
        res.json(results);
    });
});

/**
 * AJOUTER UN NOUVEAU PLAT (ADMIN)
 * UPDATE: Ajout de 'stock' dans la récupération et la requête SQL
 */
router.post("/admin/add-meal", (req, res) => {
    const { name, price, desc, image, stock } = req.body; // <-- Récupération du stock
    const sql = "INSERT INTO meals (name, price, description, image_url, stock) VALUES (?, ?, ?, ?, ?)"; // <-- Ajout colonne stock
    
    db.query(sql, [name, price, desc, image, stock], (err, result) => { // <-- Ajout valeur stock
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erreur lors de l'ajout SQL" });
        }
        res.json({ success: true, message: "Plat ajouté avec stock !", id: result.insertId });
    });
});

router.delete("/admin/delete-meal/:id", (req, res) => {
    const mealId = req.params.id;
    const sql = "DELETE FROM meals WHERE id = ?";
    db.query(sql, [mealId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur lors de la suppression" });
        res.json({ success: true, message: "Plat supprimé de la base de données" });
    });
});

// ==========================================
// 3. ROUTES ADMIN (UTILISATEURS & COMMANDES)
// ==========================================
router.get("/admin/users", (req, res) => {
    db.query("SELECT id, name, email FROM users", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur récupération utilisateurs" });
        res.json(results);
    });
});

router.get("/admin/orders", (req, res) => {
    db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur récupération commandes" });
        res.json(results);
    });
});

module.exports = router;