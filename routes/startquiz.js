const express = require("express");
const router = express.Router();

module.exports = () => {
  // ✅ Start Quiz page - works for both logged-in & guest users
  router.get("/startquiz", (req, res) => {
    // Logged-in user
    if (req.session.user && req.session.user.name) {
      return res.render("startquiz", { username: req.session.user.name });
    }

    // Guest user
    if (req.session.username) {
      return res.render("startquiz", { username: req.session.username });
    }

    // No username → redirect
    return res.redirect("/enterusername");
  });

  // ✅ API: get username for frontend JS
  router.get("/api/get-username", (req, res) => {
    const username =
      (req.session.user && req.session.user.name) || req.session.username || null;

    res.json({ username });
  });

  return router;
};
