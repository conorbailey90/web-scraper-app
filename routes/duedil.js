const express = require("express");
const puppeteer = require("puppeteer");
const router = express.Router();
const path = require("path");
var fetch = require("node-fetch");
const db = require("../queries");

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
        function newDate(date) {
          return `${date.slice(8)}-${date.slice(5, 7)}-${date.slice(0, 4)}`;
        }
        console.log(json);

        if ("httpCode" in json && json.httpCode == 404) {
          res.json(json);
        } else {
          let source = "DueDil";
          let summary = `Summary: ${json.name} is a ${
            json.officialStatus
          } company (${json.type}) registered in the ${
            json.incorporationCountry
          } at the following address: ${json.registeredAddress.fullAddress}. 
          This entity was incorporated on ${newDate(
            json.incorporationDate
          )}. The company registration number is ${json.companyId}.
          Accounts: Filing type: ${
            json.accounts.filingType
          }. Latest accounts date: ${newDate(json.accounts.latestAccountsDate)}.
          Turnover: ${
            json.financialSummary.turnover == null
              ? "Not available"
              : "GBP " + json.financialSummary.turnover
          }. Post Tax profit: ${
            json.financialSummary.postTaxProfit == null
              ? "Not available"
              : "GBP " + json.financialSummary.postTaxProfit
          }
          Total assets: ${
            json.financialSummary.totalAssets == null
              ? "Not available"
              : "GBP " + json.financialSummary.totalAssets
          }. Net assets: ${
            json.financialSummary.netAssets == null
              ? "Not available"
              : "GBP " + json.financialSummary.netAssets
          }. Data sourced from DueDil (https://www.duedil.com/)`;

          db.createCompany(source, json.name, json.companyId, summary);
          res.json(json);
        }
      });
  } catch (e) {
    console.log(e);
  }
});

router.get("/", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "duedil.html"));
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please sign in to access this feature");
  res.redirect("/users/login");
}

module.exports = router;
