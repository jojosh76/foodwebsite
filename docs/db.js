const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jojo@inator26",
  database: "canteen_web_db"
});

db.connect(err => {
  if (err) {
    console.log("❌ MySQL error:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});

module.exports = db;
