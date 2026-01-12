const express = require("express");
const router = express.Router();
const db = require("../db");

// ==========================================
// 1. AUTHENTIFICATION (LOGIN & REGISTER)
// ==========================================

// Route de Connexion
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur base de données" });

        if (results.length > 0) {
            res.json({
                success: true,
                user: { id: results[0].id, name: results[0].name, email: results[0].email }
            });
        } else {
            res.status(401).json({ success: false, message: "Email ou mot de passe invalide" });
        }
    });
});

// Route d'Inscription
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erreur : Email déjà utilisé" });
        }
        res.json({ success: true, message: "Compte créé avec succès", userId: result.insertId });
    });
});

// ==========================================
// 2. GESTION DES PLATS (MEALS) - SQL
// ==========================================

/**
 * RÉCUPÉRER TOUS LES PLATS
 * Utilisé par menu.html (étudiants) et admin.html
 */
router.get("/meals", (req, res) => {
    const sql = "SELECT * FROM meals ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erreur lecture meals" });
        }
        res.json(results);
    });
});

/**
 * AJOUTER UN NOUVEAU PLAT (ADMIN)
 * Reçoit les données de admin.js
 */
router.post("/admin/add-meal", (req, res) => {
    const { name, price, desc, image } = req.body;
    const sql = "INSERT INTO meals (name, price, description, image_url) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [name, price, desc, image], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Erreur lors de l'ajout SQL" });
        }
        res.json({ success: true, message: "Plat ajouté à la base de données", id: result.insertId });
    });
});

/**
 * SUPPRIMER UN PLAT (ADMIN)
 */
router.delete("/admin/delete-meal/:id", (req, res) => {
    const mealId = req.params.id;
    const sql = "DELETE FROM meals WHERE id = ?";
    
    db.query(sql, [mealId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erreur lors de la suppression" });
        }
        res.json({ success: true, message: "Plat supprimé de la base de données" });
    });
});

// ==========================================
// 3. ROUTES ADMIN (UTILISATEURS & COMMANDES)
// ==========================================

// Liste des utilisateurs (pour le dashboard)
router.get("/admin/users", (req, res) => {
    db.query("SELECT id, name, email FROM users", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur récupération utilisateurs" });
        res.json(results);
    });
});

// Liste de toutes les commandes
router.get("/admin/orders", (req, res) => {
    db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Erreur récupération commandes" });
        res.json(results);
    });
});

// ==========================================
module.exports = router;