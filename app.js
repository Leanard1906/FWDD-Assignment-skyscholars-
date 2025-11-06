const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const app = express();

/* ============================
  MIDDLEWARE SETUP
============================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* ---------- SESSION SETUP ---------- */
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

/* ---------- DATABASE CONNECTION ---------- */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "skyscholarsweb",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to the database");
  }
});

/* ---------- VIEW ENGINE SETUP ---------- */
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/* ---------- LOGIN CHECK MIDDLEWARE ---------- */
function checkLoggedIn(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

/* ---------- ADMIN CHECK MIDDLEWARE ---------- */
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  return res.status(403).send("Access denied. Admins only.");
}

/* ---------- TEACHER CHECK MIDDLEWARE ---------- */
function isTeacher(req, res, next) {
  if (
    req.session.user &&
    (req.session.user.role === "teacher" || req.session.user.role === "admin")
  )
    return next();
  return res.status(403).send("Access denied. Teachers only.");
}

/* ---------- MAKE USER AVAILABLE TO ALL VIEWS ---------- */
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

/* ============================
  STATIC PAGES
============================ */
app.get("/", (req, res) => res.render("main"));
app.get("/about", (req, res) => res.render("about"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/joincode", (req, res) => res.render("joincode"));
app.get("/enterusername", (req, res) => res.render("enterusername"));
app.get("/profile", checkLoggedIn, (req, res) => res.render("profile"));
app.get("/startquiz", (req, res) => res.render("startquiz"));

/* ============================
  ROUTES
============================ */
const registerRoute = require("./routes/register")(db);
app.use("/", registerRoute);

const loginRoute = require("./routes/login")(db);
app.use("/", loginRoute);

const enterUsernameRoute = require("./routes/enterusername")();
app.use("/", enterUsernameRoute);

const joincodeRoute = require("./routes/joincode")(db);
app.use("/", joincodeRoute);

const checkEmailRoute = require("./routes/checkemail")(db);
app.use("/", checkEmailRoute);

/* ---------- PROFILE ROUTE ---------- */
const profileRoute = require("./routes/profile")(db);
app.use("/profile", checkLoggedIn, profileRoute);

/* ---------- SCOREBOARD ROUTE ---------- */
const scoreboardRoute = require("./routes/scoreboard")(db);
app.use("/", scoreboardRoute);

/* ---------- QUIZ ROUTE ---------- */
const quizRoute = require("./routes/quiz");
app.use("/", quizRoute(db));

/* ---------- QUESTIONS (Teacher or Admin) ---------- */
const addQuestionRoute = require("./routes/addquestion");
app.use("/", addQuestionRoute(db, isTeacher));

const viewQuestionRoute = require("./routes/viewquestion");
app.use("/", viewQuestionRoute(db, isTeacher));

const editQuestionRoute = require("./routes/editquestion");
app.use("/", editQuestionRoute(db, isTeacher));

/* ---------- USER MANAGEMENT (Admin Only) ---------- */
const viewUserRoute = require("./routes/viewuser");
app.use("/", viewUserRoute(db, isAdmin));

const editUserRoute = require("./routes/edituser");
app.use("/", editUserRoute(db, isAdmin));

/* ---------- LOGOUT ROUTE (Fix) ---------- */
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/"); // ✅ Redirect to main page
  });
});

/* ============================
  START SERVER
============================ */
app.listen(3000, function () {
  console.log("✅ Server running on http://localhost:3000");
});
