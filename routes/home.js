const express = require("express");
const router = express.Router();
const path = require("path");
var fetch = require("node-fetch");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = router;
