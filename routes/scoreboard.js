// routes/scoreboard.js
module.exports = (db) => {
  const express = require("express");
  const router = express.Router();

  // GET: Show scoreboard (only highest score per user)
  router.get("/scoreboard", (req, res) => {
    const query = `
      SELECT username, MAX(score) AS score
      FROM scoreboard
      GROUP BY username
      ORDER BY score DESC;
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("❌ Error fetching scores:", err);
        return res.status(500).send("Database error");
      }

      res.render("scoreboard", {
        user: req.session.user,
        scores: results,
      });
    });
  });

  return router;
};
