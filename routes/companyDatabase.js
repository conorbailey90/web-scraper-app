const express = require("express");
const db = require("../queries");
const path = require("path");
const router = express.Router();
const { pool } = require("../config");

router.get("/", (req, res) => {
  pool.query(
    // CREATE TABLE IF NOT EXISTS companies
    // (id BIGSERIAL PRIMARY KEY NOT NULL,
    // source VARCHAR(50) NOT NULL,
    // company_name VARCHAR(100) NOT NULL,
    // company_number VARCHAR(50) NOT NULL,
    // company_summary VARCHAR(800),
    // last_updated DATE NOT NULL,
    // UNIQUE (source, company_number))

    `SELECT source, company_name, company_number, last_updated FROM companies ORDER BY company_name ASC`,
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      res.render("database", { title: results.rows });
    }
  );
});

module.exports = router;
