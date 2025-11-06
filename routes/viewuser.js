module.exports = (db, isAdmin) => {
  const express = require("express");
  const router = express.Router();

  // ✅ View all users (Admin only)
  router.get("/viewuser", isAdmin, (req, res) => {
    const query = "SELECT id, username, email, role FROM users ORDER BY id ASC";

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).send("Database error");
      }

      res.render("viewuser", {
        user: req.session.user,
        users: results,
      });
    });
  });

  return router;
};
