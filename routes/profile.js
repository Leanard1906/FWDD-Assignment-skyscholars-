// routes/profile.js
const express = require("express");
const bcrypt = require("bcryptjs");

module.exports = function (db) {
  const router = express.Router();

  // ----- SHOW PROFILE PAGE -----
  router.get("/", (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    const { id } = req.session.user;
    const sql = "SELECT username, email FROM users WHERE id = ?";

    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).send("Database error");

      // ✅ Ensure 'profile' is always defined
      const profile = results.length > 0 ? results[0] : { username: "", email: "" };

      res.render("profile", {
        profile,
        currentUser: req.session.user,
        hideUserControls: true
      });
    });
  });

  // ----- UPDATE USERNAME / EMAIL -----
  router.post("/update", (req, res) => {
    if (!req.session.user) return res.status(403).json({ success: false });

    const { username, email } = req.body;
    const { id } = req.session.user;

    const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";

    db.query(sql, [username, email, id], (err) => {
      if (err) return res.status(500).json({ success: false });

      // ✅ Instantly update session data
      req.session.user.username = username;
      req.session.user.email = email;

      return res.json({ success: true, message: "Profile updated successfully!" });
    });
  });

  // ----- CHANGE PASSWORD -----
  router.post("/change-password", async (req, res) => {
    if (!req.session.user) return res.status(403).json({ success: false });

    const { currentPassword, newPassword } = req.body;
    const { id } = req.session.user;

    db.query("SELECT password FROM users WHERE id = ?", [id], async (err, results) => {
      if (err || results.length === 0) return res.status(500).json({ success: false });

      const valid = await bcrypt.compare(currentPassword, results[0].password);
      if (!valid) return res.status(400).json({ success: false, message: "Incorrect current password" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id], (err2) => {
        if (err2) return res.status(500).json({ success: false });
        return res.json({ success: true, message: "Password changed successfully!" });
      });
    });
  });

  return router;
};
