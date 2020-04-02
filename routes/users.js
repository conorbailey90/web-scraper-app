const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../queries");
const { pool } = require("../config");
const bcrypt = require("bcrypt");
const passport = require("passport");

router.get("/login", checkAuthenticated, (req, res) => {
  console.log(req.messages);
  res.render("login");
});

router.get("/register", checkAuthenticated, (req, res) => {
  console.log(req.session);
  res.render("register");
});

router.get("/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.user);
  res.render("dashboard", { user: req.user.username });
});

router.get("/password", checkNotAuthenticated, (req, res) => {
  res.render("password", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You have logged out");
  res.redirect("/users/login");
});

router.post("/register", async (req, res) => {
  let { username, email, password, password2 } = req.body;
  console.log(username, email, password, password2);
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, username, email, password, password2 });
  } else {
    // Validation passed

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `
    SELECT * FROM users
    WHERE username = $1
    OR email = $2`,
      [username, email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          // User already exists
          errors.push({ msg: "User already exists" });
          res.render("register", {
            errors,
            username,
            email,
            password,
            password2
          });
        } else {
          // Add user to database
          pool.query(
            `INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3)
            ON CONFLICT DO NOTHING
            RETURNING id, password`,
            [username, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              req.flash("success_msg", "You are now registered and can log in");
              res.redirect("/users/login");
              console.log(results.rows);
            }
          );
        }
      }
    );
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

router.post("/password", async (req, res) => {
  let { password, password2 } = req.body;

  console.log({
    password,
    password2
  });
  const user = req.user;

  let errors = [];

  if (password.length < 6) {
    errors.push({ message: "New password must be at least 6 characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.render("password", { errors });
  } else {
    let newHashedPassword = await bcrypt.hash(password, 10);
    console.log(newHashedPassword);

    pool.query(
      `UPDATE users
      SET password = $1
      WHERE id = $2`,
      [newHashedPassword, req.user.id],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        req.flash("success_msg", "Your password has been updated");
        res.redirect("/users/dashboard");
      }
    );
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

module.exports = router;
