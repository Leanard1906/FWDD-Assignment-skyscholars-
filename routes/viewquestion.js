const express = require("express");
const router = express.Router();

module.exports = (db, isAdmin) => {
  // ===== FETCH ALL QUESTIONS =====
  router.get("/viewquestion", isAdmin, async (req, res) => {
    try {
      const [rows] = await db
        .promise()
        .query("SELECT * FROM questions ORDER BY id DESC");

      console.log("✅ Questions fetched:", rows.length);
      res.render("viewquestion", {
        title: "View All Questions",
        questions: rows,
      });
    } catch (err) {
      console.error("❌ Error fetching questions:", err);
      res.status(500).send("Database error while fetching questions");
    }
  });

  // ===== DELETE A QUESTION =====
  router.delete("/viewquestion/delete/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db
        .promise()
        .query("DELETE FROM questions WHERE id = ?", [id]);

      if (result.affectedRows > 0) {
        console.log(`🗑️ Deleted question ID: ${id}`);
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Question not found." });
      }
    } catch (err) {
      console.error("❌ Error deleting question:", err);
      res.status(500).json({ success: false, message: "Error deleting question." });
    }
  });

  return router;
};
