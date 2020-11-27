if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const { pool } = require("./config");
const db = require("./queries");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const MemoryStore = require('memorystore')(session)

const app = express();

app.use(express.urlencoded({ extended: false }));

const intitializePassport = require("./passport-config");

intitializePassport(passport);

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize ejs template engine
app.set("view engine", "ejs");

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  // res.locals.error = req.flash("error");
  next();
});

app.use(express.static("public"));
app.use(bodyParser.json());

// Routes
app.use("/", require("./routes/home"));
app.use("/companies/", require("./routes/chscraper.js"));
app.use("/duedil/", require("./routes/duedil"));
app.use("/opencorporates/", require("./routes/opencorporates"));
app.use("/companieshouse/", require("./routes/companieshouse"));
app.use("/database/", require("./routes/companyDatabase"));
app.use("/users/", require("./routes/users"));
app.use("/login/", require("./routes/login"));
app.use("/register/", require("./routes/register"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
