const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/payment", (req, res) => {
  const { item, unit_price, quantity, payment_method } = req.body;

  if (!item || !unit_price || !quantity || !payment_method) {
    return res.status(400).json({ message: "Missing data" });
  }

  const total = unit_price * quantity;

  db.query(
    "INSERT INTO orders (user_id, total_amount, status) VALUES (1, ?, 'paid')",
    [total],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const orderId = result.insertId;

      db.query(
        "INSERT INTO order_items (order_id, item_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?)",
        [orderId, item, unit_price, quantity, total],
        () => {

          db.query(
            "INSERT INTO payments (order_id, method, amount) VALUES (?, ?, ?)",
            [orderId, payment_method, total],
            () => {
              res.json({ success: true });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
