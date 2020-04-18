const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const path = require("path");
const cors = require("cors");
const db = require("../queries");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "ch.html"));
});

router.post("/", async (req, res) => {
  try {
    let website = req.body.URL;
    console.log(website);

    // Companies House
    if (website.slice(0, 34) == "https://beta.companieshouse.gov.uk") {
      // const browser = await puppeteer.launch({ headless: false });
      const browser = await puppeteer.launch({
        defaultViewport: { width: 1920, height: 1500 },
        args: ["--no-sandbox"]
      });
      const page = await browser.newPage();

      await page.goto(website, { waitUntil: "networkidle2" });

      let company = await page.evaluate(() => {
        let name = document.querySelector(
          "#content-container > div.company-header > p.heading-xlarge"
        ).innerText;
        let number = document.querySelector("#company-number > strong")
          .innerText;
        let incorporation = document.querySelector("#company-creation-date")
          .innerText;
        let type = document.querySelector("#company-type").innerText;
        let status = document.querySelector("#company-status").innerText;
        let address = document.querySelector("#content-container > dl > dd")
          .innerText;
        let natureOfBusiness =
          document.querySelector("#sic0") == null
            ? `The nature of business has not been registered for this entity on Companies House`
            : `As per Companies House the registered nature of business for this entity is ${
                document.querySelector("#sic0").innerText
              }. This is a standard risk industry`;

        return {
          name,
          number,
          incorporation,
          type,
          status,
          address,
          natureOfBusiness
        };
      });
      await page.evaluate(() => document.querySelector("#people-tab").click());
      await page.waitForNavigation();
      await page.evaluate(() => document.querySelector("#pscs-link").click());
      await page.waitForNavigation();

      let psc = await page.evaluate(() => {
        // Establish how many PSC's are listed - converting the string to integer
        const pscTotal =
          document.querySelector("#company-pscs").innerText.slice(0, 1) == null // if element not found, set value to 0
            ? 0
            : parseInt(
                document.querySelector("#company-pscs").innerText.slice(0, 1)
              );

        // Convert PSC's elements to an array. Remove the first element with slice as this is not a person.
        let pscs =
          document.getElementsByClassName("heading-medium") === null
            ? []
            : Array.from(
                document.getElementsByClassName("heading-medium")
              ).slice(1);
        // remove first element as the is the section header

        let pscDetails = "";

        // Add all PSC names to the pscDetails variable
        for (let i = 0; i < pscTotal; i++) {
          pscDetails +=
            pscTotal > 1
              ? `${pscs[i].children[0].innerText.trim()}, ` // Comma added for multipe PSC's
              : `${pscs[i].children[0].innerText.trim()} `;
        }

        // Attach the following string to the pscDetails variable depending on whether single or multiple owners.
        pscDetails +=
          pscTotal > 1
            ? `are registered as persons/entities with significant control of this entity on Companies House.`
            : `is registered as a person/entity with significant control of this entity on Companies House.`;

        if (pscTotal == 0) {
          pscDetails = `There are no active persons / entities with significant control registered for this entity on Companies House.`;
        }

        return {
          pscDetails
        };
      });

      company.psc = psc.pscDetails; // Add person with significant control to company object

      await browser.close();

      let details = `${company.name} is a UK registered ${company.type} which was incorporated on ${company.incorporation} (${company.number}). The company status
      is ${company.status}. The registered address for this entity is: ${company.address}. The UK is a low risk jurisdiction. ${company.natureOfBusiness}. ${company.psc}`;

      res.json({ details });
    } else if (website.length < 10) {
      // const browser = await puppeteer.launch({ headless: false });
      const browser = await puppeteer.launch({
        defaultViewport: { width: 1920, height: 1500 },
        args: ["--no-sandbox"]
      });
      const page = await browser.newPage();

      await page.goto(`https://beta.companieshouse.gov.uk/company/${website}`, {
        waitUntil: "networkidle2"
      });

      let company = await page.evaluate(() => {
        let name = document.querySelector(
          "#content-container > div.company-header > p.heading-xlarge"
        ).innerText;
        let number = document.querySelector("#company-number > strong")
          .innerText;
        let incorporation = document.querySelector("#company-creation-date")
          .innerText;
        let type = document.querySelector("#company-type").innerText;
        let status = document.querySelector("#company-status").innerText;
        let address = document.querySelector("#content-container > dl > dd")
          .innerText;
        let natureOfBusiness =
          document.querySelector("#sic0") == null
            ? `The nature of business has not been registered for this entity on Companies House`
            : `As per Companies House the registered nature of business for this entity is ${
                document.querySelector("#sic0").innerText
              }. This is a standard risk industry`;

        return {
          name,
          number,
          incorporation,
          type,
          status,
          address,
          natureOfBusiness
        };
      });
      await page.evaluate(() => document.querySelector("#people-tab").click());
      await page.waitForNavigation();
      await page.evaluate(() => document.querySelector("#pscs-link").click());
      await page.waitForNavigation();

      let psc = await page.evaluate(() => {
        // Establish how many PSC's are listed - converting the string to integer
        const pscTotal =
          document.querySelector("#company-pscs").innerText.slice(0, 1) == null // if element not found, set value to 0
            ? 0
            : parseInt(
                document.querySelector("#company-pscs").innerText.slice(0, 1)
              );

        // Convert PSC's elements to an array. Remove the first element with slice as this is not a person.
        let pscs =
          document.getElementsByClassName("heading-medium") === null
            ? []
            : Array.from(
                document.getElementsByClassName("heading-medium")
              ).slice(1);
        // remove first element as this is the section header

        let pscDetails = "";

        // Add all PSC names to the pscDetails variable
        for (let i = 0; i < pscTotal; i++) {
          pscDetails +=
            pscTotal > 1
              ? `${pscs[i].children[0].innerText.trim()}, ` // Comma added for multipe PSC's
              : `${pscs[i].children[0].innerText.trim()} `;
        }

        // Attach the following string to the pscDetails variable depending on whether single or multiple owners.
        pscDetails +=
          pscTotal > 1
            ? `are registered as persons/entities with significant control of this entity on Companies House.`
            : `is registered as a person/entity with significant control of this entity on Companies House.`;

        if (pscTotal == 0) {
          pscDetails = `There are no active persons / entities with significant control registered for this entity on Companies House.`;
        }

        return {
          pscDetails
        };
      });

      company.psc = psc.pscDetails; // Add person with significant control to company object

      await browser.close();

      // Source declaration for database.
      let source = "Companies House";

      let details = `${company.name} is a UK registered ${company.type} which was incorporated on ${company.incorporation} (${company.number}). The company status is ${company.status}. The registered address for this entity is: ${company.address}. The UK is a low risk jurisdiction. ${company.natureOfBusiness}. ${company.psc}`;

      // Add / update record in Postgres database
      db.createCompany(source, company.name, company.number, details);

      res.json({ details });
    } else {
      res.json({ details: "Not a valid website" });
    }
  } catch (e) {
    console.log(e);
    res.json({
      details:
        "Something went wrong! Please ensure your URL is correct and try again."
    });
  }
});

module.exports = router;
