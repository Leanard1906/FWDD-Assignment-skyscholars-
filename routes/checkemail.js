const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/check-email", (req, res) => {
    const { email } = req.query;
    if (!email) return res.json({ exists: false });

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ exists: results.length > 0 });
    });
  });

  return router;
};
