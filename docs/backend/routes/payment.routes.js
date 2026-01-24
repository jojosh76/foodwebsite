const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/payment", (req, res) => {
  const { mealId, item, unit_price, quantity, payment_method } = req.body;

  if (!item || !unit_price || !quantity || !payment_method) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  const total = unit_price * quantity;

  // 1. Insertion de la commande
  // Note: On garde 1 pour l'instant, mais assure-toi qu'un utilisateur avec l'ID 1 existe.
  db.query(
    "INSERT INTO orders (user_id, total_amount, status) VALUES (18, ?, 'paid')",
    [total],
    (err, result) => {
      if (err) {
        console.error("Erreur Order (Vérifie si user_id=1 existe):", err.sqlMessage);
        return res.status(500).json({ message: "Erreur lors de la création de la commande" });
      }

      const orderId = result.insertId;

      // 2. Détails de la commande
      db.query(
        "INSERT INTO order_items (order_id, item_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?)",
        [orderId, item, unit_price, quantity, total],
        (errItems) => {
          if (errItems) console.error("Erreur Items:", errItems.sqlMessage);

          // CORRECTION ENUM : Transformation de la méthode
          let formattedMethod = payment_method.toLowerCase(); 
          if (formattedMethod === 'orange_money' || formattedMethod === 'orange money') {
            formattedMethod = 'om';
          } else if (formattedMethod === 'mtn' || formattedMethod === 'mobile money') {
            formattedMethod = 'momo';
          }

          // 3. Enregistrement du paiement avec formattedMethod
          db.query(
            "INSERT INTO payments (order_id, method, amount, payment_status) VALUES (?, ?, ?, ?)",
            [orderId, formattedMethod, total, 'success'], // <-- Utilisation de la variable corrigée
            (errPay) => {
              if (errPay) {
                console.error("Erreur Payment (Vérifie l'ENUM):", errPay.sqlMessage);
                // On continue quand même pour ne pas bloquer l'utilisateur si le stock peut être mis à jour
              }

              // 4. Mise à jour du stock
              if (mealId) {
                const sqlUpdateStock = "UPDATE meals SET stock = stock - ? WHERE id = ? AND stock >= ?";
                db.query(sqlUpdateStock, [quantity, mealId, quantity], (stockErr, stockResult) => {
                  if (stockErr) {
                    console.error("Erreur SQL Stock (La colonne 'stock' existe-t-elle ?):", stockErr.sqlMessage);
                    return res.json({ success: true, warning: "Paiement ok, mais stock non mis à jour" });
                  }

                  if (stockResult.affectedRows === 0) {
                    return res.json({ success: true, message: "Paiement réussi, mais stock épuisé entre-temps." });
                  }

                  res.json({ success: true, message: "Commande et stock validés !" });
                });
              } else {
                res.json({ success: true });
              }
            }
          );
        }
      );
    }
  );
});

module.exports = router;