const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const os = require("os");
const QRCode = require("qrcode");
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

/* ---------- LOGIN & ROLE MIDDLEWARE ---------- */
function checkLoggedIn(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") return next();
  return res.status(403).send("Access denied. Admins only.");
}

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
app.use("/", require("./routes/register")(db));
app.use("/", require("./routes/login")(db));
app.use("/", require("./routes/enterusername")());
app.use("/", require("./routes/joincode")(db));
app.use("/", require("./routes/checkemail")(db));
app.use("/profile", checkLoggedIn, require("./routes/profile")(db));
app.use("/", require("./routes/scoreboard")(db));
app.use("/", require("./routes/quiz")(db));
app.use("/", require("./routes/addquestion")(db, isTeacher));
app.use("/", require("./routes/viewquestion")(db, isTeacher));
app.use("/", require("./routes/editquestion")(db, isTeacher));
app.use("/", require("./routes/viewuser")(db, isAdmin));
app.use("/", require("./routes/edituser")(db, isAdmin));

/* ---------- QR CODE ROUTE ---------- */
app.get("/quizqr", (req, res) => {
  const IP = getLocalIP(); // use PC LAN IP
  const url = `http://${IP}:3000/joincode`; // use LAN URL

  QRCode.toDataURL(url, (err, qrImage) => {
    if (err) return res.send("Error generating QR");
    res.render("quizqr", { qr: qrImage, url });
  });
});

/* ---------- LOGOUT ROUTE ---------- */
app.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

/* ============================
  START SERVER (LAN ENABLED)
============================ */
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "localhost";
}

const PORT = 3000;
const IP = getLocalIP();

app.listen(PORT, "0.0.0.0", () => {
  console.log("=====================================================");
  console.log(`✅ Server running on this PC: http://localhost:${PORT}`);
  console.log(`🌍 Access on other devices:  http://${IP}:${PORT}`);
  console.log("=====================================================");
});
