const express = require("express");
const db = require("../queries");
const path = require("path");
const router = express.Router();
const { pool } = require("../config");

router.get("/", checkNotAuthenticated, (req, res) => {
  pool.query(
    // CREATE TABLE IF NOT EXISTS companies
    // (id BIGSERIAL PRIMARY KEY NOT NULL,
    // source VARCHAR(50) NOT NULL,
    // company_name VARCHAR(100) NOT NULL,
    // company_number VARCHAR(50) NOT NULL,
    // company_summary VARCHAR(800),
    // last_updated DATE NOT NULL,
    // UNIQUE (source, company_number))

    `SELECT id, company_name, company_number, source, last_updated FROM companies ORDER BY last_updated DESC LIMIT 6`,
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      res.render("database", { results: results.rows });
    }
  );
});

router.get(
  "/companies/:db_id",
  checkNotAuthenticated,
  isLoggedIn,
  (req, res) => {
    let id = req.params.db_id;
    pool.query(
      `SELECT * FROM companies WHERE id = $1`,
      [id],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        res.render("dbCompany", {
          results: results.rows,
          isLogged: req.isLogged
        });
      }
    );
  }
);

router.post("/", (req, res) => {
  let name = req.body.name;

  console.log(name);

  pool.query(
    "SELECT id, company_name, company_number, source, last_updated FROM companies WHERE company_name ILIKE '%' || $1 || '%'",
    [name],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      res.json({ dbResults: results.rows });
    }
  );
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please sign in to access the company database");
  res.redirect("/users/login");
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    req.isLogged = true;
    return next();
  }
  req.isLogged = false;
  next();
}

module.exports = router;
