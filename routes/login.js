const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

module.exports = (db) => {
  // ---------- SHOW LOGIN PAGE ----------
  router.get("/login", (req, res) => {
    res.render("login", { user: req.session.user });
  });

  // ---------- HANDLE LOGIN ----------
  router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please enter both email and password." });

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ message: "Database error." });
      }

      if (results.length === 0)
        return res.status(401).json({ message: "Invalid email or password." });

      const user = results[0];
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid email or password." });

      // ✅ Save user in session
      req.session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      };
      req.session.loggedin = true;

      console.log("✅ Logged in:", req.session.user);
      res.json({ message: "Login successful!" });
    });
  });

  // ---------- LOGOUT ----------
  router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
  });

  return router;
};
