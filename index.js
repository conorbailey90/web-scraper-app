const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const app = express();

// Body parser is use to obain the input from the form in the index.html page.
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use(express.static("public"));

submitCount = 0;

app.post("/", async (req, res) => {
  try {
    let website = req.body.URL;
    console.log(website);

    // Companies House
    if (website.slice(0, 34) == "https://beta.companieshouse.gov.uk") {
      // const browser = await puppeteer.launch({ headless: false });
      const browser = await puppeteer.launch({
        defaultViewport: { width: 1920, height: 1280 },
        args: ["--no-sandbox"]
      });
      const page = await browser.newPage();

      await page.goto(website, { waitUntil: "networkidle2" });

      await page.screenshot({ path: "./public/CompaniesHouse1.png" });

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
        let natureOfBusiness = document.querySelector("#sic0").innerText;

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
        const pscTotal = parseInt(
          document.querySelector("#company-pscs").innerText.slice(0, 1)
        );
        let pscs = Array.from(
          document.getElementsByClassName("heading-medium")
        ).slice(1);

        let pscDetails = "";

        for (let i = 0; i < pscTotal; i++) {
          pscDetails +=
            pscTotal > 1
              ? `${pscs[i].children[0].innerText.trim()}, `
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

      await page.screenshot({ path: "./public/CompaniesHouse2.png" });
      await browser.close();

      submitCount++;

      let details = `${company.name} is a UK registered ${company.type} which was incorporated on ${company.incorporation} (${company.number}). The company status
    is ${company.status}. The registered address for this entity is: ${company.address}. The UK is a low risk jurisdiction. The nature of business
    for this entity is registered as: ${company.natureOfBusiness}. This is a standard risk industry. ${company.psc}`;
      res.json({ details, submitCount });
      // res.json({ chss });
      // res.send(chss);

      // Companycheck website
    } else if (website.slice(0, 26) == "https://companycheck.co.uk") {
      const browser = await puppeteer.launch({
        defaultViewport: { width: 1920, height: 1280 },
        args: ["--no-sandbox"]
      });
      const page = await browser.newPage();

      await page.goto(website, { waitUntil: "networkidle2" });

      let company = await page.evaluate(() => {
        function nullCheck(jsSelector) {
          let selector =
            jsSelector == null ? "UNDEFINED" : jsSelector.innerText;
          return selector;
        }

        let name = nullCheck(
          document.querySelector(
            "#summary > div > section.Summary > div.Summary__left > div:nth-child(1) > p"
          )
        );
        let number = nullCheck(
          document.querySelector(
            "body > div.outer-container > div > div.content > div.Company-header.Company-header--agriculture > div > div.Company-header__content > div.Company-header__left > ul > li:nth-child(5) > a > span"
          )
        );
        let incorporation = nullCheck(
          document.querySelector(
            "#summary > div > section.Summary > div.Summary__left > div:nth-child(4) > p"
          )
        );
        let type = nullCheck(
          document.querySelector(
            "#summary > div > section.Summary > div.Summary__left > div:nth-child(2) > p"
          )
        );
        let status = nullCheck(
          document.querySelector(
            "#summary > div > section.Summary > div.Summary__left > div:nth-child(3) > p"
          )
        );
        let address = nullCheck(
          document.querySelector(
            "body > div.outer-container > div > div.content > div.Company-header.Company-header--agriculture > div > div.Company-header__content > div.Company-header__left > p > span"
          )
        );
        let natureOfBusiness = nullCheck(
          document.querySelector(
            "#summary > div > section.Summary > div.Summary__right > div:nth-child(1) > p"
          )
        );
        let netWorth = nullCheck(
          document.querySelector(
            "#DataTables_Table_1 > tbody > tr:nth-child(2) > td:nth-child(6)"
          )
        );
        let currentAssets = nullCheck(
          document.querySelector(
            "#DataTables_Table_1 > tbody > tr:nth-child(3) > td:nth-child(6)"
          )
        );
        let psc = nullCheck(
          document.querySelector(
            "#DataTables_Table_0 > tbody > tr:nth-child(1) > td:nth-child(1) > a"
          )
        );

        return {
          name,
          number,
          incorporation,
          type,
          status,
          address,
          natureOfBusiness,
          netWorth,
          currentAssets,
          psc
        };
      });
      await browser.close();

      let details = `${company.name} is a UK registered ${company.type} which was incorporated on ${company.incorporation} (${company.number}). The company status
    is ${company.status}. The registered address for this entity is: ${company.address}. The UK is a low risk jurisdiction. The nature of business
    for this entity is registered as: ${company.natureOfBusiness}. This is a standard risk industry. ${company.psc} is listed as a person / entity with 
    significant control of this entity as per the Companycheck company registration website.`;
      res.send(details);
    } else {
      res.send("Not a valid website");
    }
  } catch (e) {
    console.log(e);
    res.send(
      "Something went wrong! Please ensure your URL is correct and try again."
    );
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
