const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // ===== Display Join Code Page =====
  router.get("/joincode", (req, res) => {
    res.render("joincode");
  });

  // ===== Check Join Code =====
  router.post("/join", (req, res) => {
    const { joinCode } = req.body;
    console.log("🔍 Received join code:", joinCode);

    const sql = "SELECT * FROM quiz_sessions WHERE code = ?";
    db.query(sql, [joinCode], (err, results) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Server error. Please try again." });
      }

      console.log("✅ Query results:", results);

      if (results.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "❌ Invalid or expired join code." });
      }

      const sessionData = results[0];
      req.session.roomcode = sessionData.code;
      req.session.topic = sessionData.topic;

      res.json({
        success: true,
        redirect: `/quiz?roomcode=${sessionData.code}`,
      });
    });
  });


  return router;
};
