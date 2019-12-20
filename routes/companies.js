const express = require("express");
const puppeteer = require("puppeteer");

const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "companyss.html"));
});

module.exports = router;
