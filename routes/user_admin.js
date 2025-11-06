const express = require("express");
const router = express.Router();

module.exports = (db, isAdmin) => {

  // ===== View all users =====
  router.get("/viewuser", isAdmin, (req, res) => {
    const sql = "SELECT id, username, email, role FROM users ORDER BY id ASC";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error fetching users:", err);
        return res.status(500).send("Database error");
      }
      res.render("viewuser", { users: results, loggedInUser: req.session.user });
    });
  });

  // ===== Show single user for editing =====
  router.get("/edituser/:id", isAdmin, (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("❌ Error fetching user:", err);
        return res.status(500).send("Database error");
      }
      if (result.length === 0) return res.status(404).send("User not found");

      // ✅ send BOTH: logged-in user & user being edited
      res.render("edituser", { 
        editUser: result[0], 
        loggedInUser: req.session.user 
      });
    });
  });

  // ===== Update user =====
  router.post("/edituser/:id", isAdmin, (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const sql = "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?";
    db.query(sql, [username, email, role, id], (err) => {
      if (err) {
        console.error("❌ Error updating user:", err);
        return res.status(500).send("Database error");
      }
      console.log(`✅ User ${id} updated successfully`);
      res.redirect("/viewuser");
    });
  });

  // ===== Delete user (POST) =====
  router.post("/viewuser/delete/:id", isAdmin, (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err) => {
      if (err) {
        console.error("❌ Error deleting user:", err);
        return res.status(500).send("Database error");
      }
      console.log(`🗑️ Deleted user ID: ${id}`);
      res.redirect("/viewuser");
    });
  });

  return router;
};
