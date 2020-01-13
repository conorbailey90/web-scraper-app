const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const router = express.Router();
var fetch = require("node-fetch");

router.post("/", async (req, res) => {
  try {
    let companyNumber = req.body.companyNumber;
    let country = req.body.country;

    console.log(companyNumber);
    console.log(country);

    const url = `https://api.opencorporates.com/v0.4/companies/${country}/${companyNumber}`;

    console.log(url);

    fetch(url, {
      method: "GET"
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
  res.sendFile(path.join(__dirname, "../public", "opencorporates.html"));
});

module.exports = router;
