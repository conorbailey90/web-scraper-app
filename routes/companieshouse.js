const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const path = require("path");

//Retrieve summary from Companies House
router.get("/:companyID", async (req, res) => {
  var companyNumber = req.params.companyID;

  const website = `https://beta.companieshouse.gov.uk/company/${companyNumber}`;

  console.log(website);

  try {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1280 },
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();

    await page.goto(website, { waitUntil: "networkidle2" });

    let company = await page.evaluate(() => {
      let name = document.querySelector(
        "#content-container > div.company-header > p.heading-xlarge"
      ).innerText;
      let number = document.querySelector("#company-number > strong").innerText;
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
      const pscTotal = parseInt(
        document.querySelector("#company-pscs").innerText.slice(0, 1)
      );

      // Convert PSC's elements to an array. Remove the first element with slice as this is not a person.
      let pscs = Array.from(
        document.getElementsByClassName("heading-medium")
      ).slice(1);

      let pscDetails = "";

      for (let i = 0; i < pscTotal; i++) {
        pscDetails +=
          pscTotal > 1
            ? `${pscs[i].children[0].innerText.trim()}, ` // Comma added for multipe PSC's
            : `${pscs[i].children[0].innerText.trim()} `;
      }

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
    res.send(details);
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send(
        "Something went wrong! Please ensure your URL is correct and try again."
      );
  }
});

module.exports = router;
