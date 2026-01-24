const express = require("express");
const router = express.Router();
const db = require("../db");


// ==========================
// ROUTE LOGIN
// ==========================
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length > 0) {
            res.json({
                success: true,
                user: {
                    id: results[0].id,
                    name: results[0].name,
                    email: results[0].email
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
    });
});


// ==========================
// ROUTE REGISTER
// ==========================
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Email déjà existant ou erreur base de données"
            });
        }

        res.json({
            success: true,
            message: "Utilisateur créé avec succès",
            userId: result.insertId
        });
    });
});


// ==========================
// ROUTES ADMIN
// ==========================

// Récupérer tous les utilisateurs (ADMIN)
router.get("/admin/users", (req, res) => {
    db.query("SELECT id, name, email FROM users", (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erreur récupération utilisateurs"
            });
        }
        res.json(results);
    });
});


// Récupérer toutes les commandes (ADMIN)
router.get("/admin/orders", (req, res) => {
    db.query(
        "SELECT * FROM orders ORDER BY created_at DESC",
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Erreur récupération commandes"
                });
            }
            res.json(results);
        }
    );
});


// ==========================
module.exports = router;
