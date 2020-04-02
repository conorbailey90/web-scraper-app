const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../queries");

router.get("/", (req, res) => {
  res.render("login");
});

module.exports = router;
