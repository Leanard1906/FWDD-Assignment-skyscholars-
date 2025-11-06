module.exports = (db, isAdmin) => {
  const express = require("express");
  const router = express.Router();

  // ✅ GET: Show edit form
  router.get("/edituser/:id", isAdmin, (req, res) => {
    const userId = req.params.id;
    const query = "SELECT id, username, email, role FROM users WHERE id = ?";

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("❌ Error fetching user:", err);
        return res.status(500).send("Database error");
      }

      if (results.length === 0) {
        return res.status(404).send("User not found");
      }

      res.render("edituser", { 
        userData: results[0],         // ✅ user being edited
        currentUser: req.session.user, // ✅ logged in user
        hideUserControls: true        // ✅ hide navbar user controls
      });
    });
  });

  // ✅ POST: Save updated user
  router.post("/edituser/:id", isAdmin, (req, res) => {
    const { username, email, role } = req.body;
    const userId = req.params.id;

    const updateQuery = `
      UPDATE users
      SET username = ?, email = ?, role = ?
      WHERE id = ?
    `;

    db.query(updateQuery, [username, email, role, userId], (err) => {
      if (err) {
        console.error("❌ Error updating user:", err);
        return res.status(500).send("Database error");
      }

      res.redirect("/viewuser");
    });
  });

  return router;
};
