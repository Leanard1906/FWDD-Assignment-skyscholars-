const express = require("express");
const router = express.Router();

module.exports = (db, isAdmin) => {
  // ===== Show Edit Question Page (List) =====
  router.get("/editquestion", isAdmin, (req, res) => {
    const sql = "SELECT * FROM questions";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error fetching questions:", err);
        return res.status(500).send("Database error");
      }
      res.render("editquestion", { questions: results });
    });
  });

  // ===== Show Single Question for Edit =====
  router.get("/editquestion/:id", isAdmin, (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM questions WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("❌ Error fetching question:", err);
        return res.status(500).send("Database error");
      }
      if (result.length === 0) return res.status(404).send("Question not found");
      res.render("editquestion", { question: result[0] });
    });
  });

  // ===== Update Question =====
  router.post("/editquestion/:id", isAdmin, (req, res) => {
    const { id } = req.params;
    const { topic, question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    const sql = `
      UPDATE questions
      SET topic = ?, question = ?, optionA = ?, optionB = ?, optionC = ?, optionD = ?, correctAnswer = ?
      WHERE id = ?
    `;

    db.query(sql, [topic, question, optionA, optionB, optionC, optionD, correctAnswer, id], (err) => {
      if (err) {
        console.error("❌ Error updating question:", err);
        return res.status(500).send("Database error");
      }
      console.log(`✅ Question ${id} updated successfully`);
      res.redirect("/viewquestion"); // ✅ Redirects to view question page
    });
  });

  // ===== Delete Question =====
  router.post("/deletequestion/:id", isAdmin, (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM questions WHERE id = ?";
    db.query(sql, [id], (err) => {
      if (err) {
        console.error("❌ Error deleting question:", err);
        return res.status(500).send("Database error");
      }
      console.log(`🗑️ Question ${id} deleted successfully`);
      res.redirect("/editquestion");
    });
  });

  return router;
};
