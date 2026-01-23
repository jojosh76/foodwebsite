const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/payment", (req, res) => {
  // On récupère mealId et quantity (ex: 1, 2, 5...)
  const { mealId, item, unit_price, quantity, payment_method } = req.body;

  // Validation des données entrantes
  if (!item || !unit_price || !quantity || !payment_method) {
    return res.status(400).json({ message: "Missing data" });
  }

  const total = unit_price * quantity;

  // 1. Insertion de la commande globale
  db.query(
    "INSERT INTO orders (user_id, total_amount, status) VALUES (1, ?, 'paid')",
    [total],
    (err, result) => {
      if (err) {
        console.error("Erreur Order:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const orderId = result.insertId;

      // 2. Insertion des détails de l'article commandé
      db.query(
        "INSERT INTO order_items (order_id, item_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?)",
        [orderId, item, unit_price, quantity, total],
        (errItems) => {
          if (errItems) console.error("Erreur Items:", errItems);

          // 3. Enregistrement du paiement
          db.query(
            "INSERT INTO payments (order_id, method, amount) VALUES (?, ?, ?)",
            [orderId, payment_method, total],
            (errPay) => {
              if (errPay) console.error("Erreur Payment:", errPay);

              // === LOGIQUE DE DIMINUTION DU STOCK (1 ou n plats) ===
              if (mealId) {
                // On soustrait la quantité exacte commandée
                // La condition 'stock >= quantity' évite les stocks négatifs
                const sqlUpdateStock = "UPDATE meals SET stock = stock - ? WHERE id = ? AND stock >= ?";
                
                db.query(
                  sqlUpdateStock,
                  [quantity, mealId, quantity],
                  (stockErr, stockResult) => {
                    if (stockErr) {
                      console.error("Erreur mise à jour stock:", stockErr);
                      return res.json({ success: true, warning: "Paiement réussi, mais erreur de mise à jour stock" });
                    }

                    // On vérifie si une ligne a vraiment été modifiée
                    if (stockResult.affectedRows === 0) {
                      console.warn(`Stock insuffisant pour le plat ID: ${mealId}`);
                      return res.json({ success: true, message: "Paiement effectué, mais le stock est désormais épuisé." });
                    }

                    res.json({ success: true, message: `Commande validée. Stock réduit de ${quantity}.` });
                  }
                );
              } else {
                // Si pas de mealId (cas rare), on valide quand même
                res.json({ success: true });
              }
              // ===============================================
            }
          );
        }
      );
    }
  );
});

module.exports = router;