const express = require("express");
const router = express.Router();

module.exports = () => {
  // GET: Show enter username page
  router.get("/enterusername", (req, res) => {
    res.render("enterusername");
  });

  // POST: Save username and redirect to quiz
  router.post("/enterusername", (req, res) => {
    const { username } = req.body;

    if (!username || username.trim() === "") {
      return res.status(400).send("Invalid username.");
    }

    // ✅ Store in session
    req.session.username = username.trim();

    // ✅ Redirect straight to quiz after saving
    res.redirect("/quiz");
  });

  return router;
};
