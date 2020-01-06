const express = require("express");
const puppeteer = require("puppeteer");
const router = express.Router();
const path = require("path");
var fetch = require("node-fetch");

router.post("/", async (req, res) => {
  try {
    let companyNumber = req.body.companyName;

    const url = `https://duedil.io/v4/company/gb/${companyNumber}.json`;

    fetch(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": "e31e630750ee76f42f387798fca15f22"
      }
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);

        res.json(json);
      });
  } catch (e) {
    console.log(e);
  }
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "duedil.html"));
});

module.exports = router;
