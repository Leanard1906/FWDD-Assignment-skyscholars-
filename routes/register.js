const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

module.exports = (db) => {
  // ---------- HANDLE REGISTER ----------
  router.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    // ✅ Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Check if email already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ message: "Database error." });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists." });
      }

      // ✅ Hash password using bcryptjs
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("❌ Error hashing password:", err);
          return res.status(500).json({ message: "Error hashing password." });
        }

        // ✅ Insert new user into database
        const insertQuery = `
          INSERT INTO users (username, email, password, role)
          VALUES (?, ?, ?, ?)
        `;
        db.query(insertQuery, [username, email, hashedPassword, "student"], (err) => {
          if (err) {
            console.error("❌ Insert error:", err);
            return res.status(500).json({ message: "Database insert failed." });
          }

          console.log(`✅ User registered: ${username} (${email}) - Role: student`);

          // ✅ Optional: Automatically log them in
          req.session.user = { name: username, email, role: "student" };

          // ✅ Success response for AJAX
          res.status(200).json({ message: "Registration successful!" });
        });
      });
    });
  });

  return router;
};
