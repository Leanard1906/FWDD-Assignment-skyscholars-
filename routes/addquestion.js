const express = require("express");
const router = express.Router();

module.exports = (db, isAdmin) => {
  // ===== GET: Render Add Question Page (Admin Only) =====
  router.get("/addquestion", isAdmin, (req, res) => {
    res.render("addquestion");
  });

  // ===== POST: Save Questions to Database =====
  router.post("/addquestion", isAdmin, async (req, res) => {
    const { topic, questions } = req.body;

    if (!topic || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: "Invalid data format." });
    }

    try {
      // 1️⃣ Check if there's already a quiz session for this topic
      const [existing] = await db.promise().query(
        "SELECT code FROM quiz_sessions WHERE topic = ?",
        [topic]
      );

      let roomCode;
      if (existing.length > 0) {
        // Existing room found
        roomCode = existing[0].code;
        console.log(`📘 Existing room found for topic ${topic}: ${roomCode}`);
      } else {
        // 2️⃣ No existing room → generate and insert new one
        roomCode = generateRoomCode();
        await db
          .promise()
          .query("INSERT INTO quiz_sessions (code, topic) VALUES (?, ?)", [
            roomCode,
            topic,
          ]);
        console.log(`🆕 New room created for topic ${topic}: ${roomCode}`);
      }

      // 3️⃣ Insert questions into the "questions" table
      const sql = `
        INSERT INTO questions (topic, roomCode, question, optionA, optionB, optionC, optionD, correctAnswer)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const q of questions) {
        await db.promise().query(sql, [
          topic,
          roomCode,
          q.question,
          q.options.A,
          q.options.B,
          q.options.C,
          q.options.D,
          q.correctAnswer,
        ]);
      }

      // ✅ Success
      res.json({
        success: true,
        message: `✅ Questions added successfully! Room Code: ${roomCode}`,
        roomCode,
      });
    } catch (err) {
      console.error("❌ Error saving questions:", err);
      res.status(500).json({ success: false, message: "Server error while saving questions." });
    }
  });

  return router;
};

// ===== Helper: Generate Random Room Code =====
function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
