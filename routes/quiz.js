const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // ===== Render Quiz Page =====
  router.get("/quiz", (req, res) => {
    const username =
      (req.session.user && req.session.user.name) || req.session.username;
    const roomcode = req.query.roomcode || req.session.roomcode;

    if (!username) return res.redirect("/enterusername");
    if (!roomcode) return res.redirect("/joincode");

    res.render("quiz", { username, roomcode });
  });

  // ===== Fetch Questions from DB (based on roomcode) =====
  router.get("/api/questions", (req, res) => {
    const roomcode = req.session.roomcode || req.query.roomcode;

    if (!roomcode)
      return res.status(400).json({ error: "Missing room code" });

    const sql = `
      SELECT id, topic, question, optionA, optionB, optionC, optionD, correctAnswer
      FROM questions
      WHERE roomcode = ?
    `;
    db.query(sql, [roomcode], (err, results) => {
      if (err) {
        console.error("❌ Error fetching quiz questions:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: "No questions found for this room code" });
      }

      // Shuffle the questions randomly
      results.sort(() => Math.random() - 0.5);

      res.json(results);
    });
  });

  // ===== Save Score =====
  router.post("/api/save-score", (req, res) => {
    const { score } = req.body;
    const username =
      (req.session.user && req.session.user.name) || req.session.username;

    if (!username)
      return res.status(401).json({ error: "Missing username" });

    const sql = `
      INSERT INTO scoreboard (username, score)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        score = VALUES(score),
        created_at = CURRENT_TIMESTAMP
    `;

    db.query(sql, [username, score], (err) => {
      if (err) {
        console.error("❌ Error saving score:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true });
    });
  });

  return router;
};
