const express = require("express");
const puppeteer = require("puppeteer");
const router = express.Router();
const path = require("path");

router.post("/", async (req, res) => {
  try {
    let company = req.body.companyName;
    const website = "https://www.duedil.com/search/companies";

    console.log(company);
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 2000 },
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process"
      ],
      headless: false
    });

    const page = await browser.newPage();
    await page.goto(website, { waitUntil: "networkidle2" });

    await page.evaluate(() => {
      document.querySelector("#main > div.dark-modal > div").remove();
      document;
      setTimeout(() => {
        document
          .querySelector(
            "#main > div.full-height-page.js-search-view > div > div.search-sidebar.search-sidebar--filter-bar-open > div.search-filter-wrapper > div > div:nth-child(1) > div > div:nth-child(1) > div.search-filter-bar__group__info"
          )
          .click();
      }, 1000);
      setTimeout(() => {
        document
          .querySelector(
            "#main > div.full-height-page.js-search-view > div > div.search-sidebar.search-sidebar--filter-bar-open > div.search-filter-wrapper > div > div > div.search-filter-bar-content > div.search-filter-bar-content__filter-picker > div:nth-child(1)"
          )
          .click();
      }, 1500);
    });

    await page.waitForSelector(
      "#main > div.full-height-page.js-search-view > div > div.search-sidebar.search-sidebar--filter-bar-open > div.search-filter-wrapper > div > div > div.search-filter-bar-content > div.search-filter-bar-content__filter-wrapper > div > div.search-text-filter.search-filter > input[type=text]"
    );

    await page.click(
      "#main > div.full-height-page.js-search-view > div > div.search-sidebar.search-sidebar--filter-bar-open > div.search-filter-wrapper > div > div > div.search-filter-bar-content > div.search-filter-bar-content__filter-wrapper > div > div.search-text-filter.search-filter > input[type=text]"
    );
    // Focus on the input field
    await page.focus(
      "#main > div.full-height-page.js-search-view > div > div.search-sidebar.search-sidebar--filter-bar-open > div.search-filter-wrapper > div > div > div.search-filter-bar-content > div.search-filter-bar-content__filter-wrapper > div > div.search-text-filter.search-filter > input[type=text]"
    );
    // Enter some text into the input field
    await page.keyboard.type(company);

    await page.evaluate(() => {
      setTimeout(() => {
        document
          .querySelector(
            "#main > div.full-height-page.js-search-view > div > div.search-main-panel > div.search-results > div > div.scroll-grid__pinned > div:nth-child(2) > div > div:nth-child(3) > div > div > a"
          )
          .click();
      }, 1000);
    });

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    let companyDetails = await page.evaluate(() => {
      function nullCheck(jsSelector) {
        let selector = jsSelector == null ? "" : jsSelector.innerText;
        return selector;
      }

      let name = nullCheck(
        document.querySelector(
          "#main > div.container-fluid.content-header-wrapper.profile-header-wrapper > div > div > div > div > h1"
        )
      );

      let status = nullCheck(
        document.querySelector(
          "#main > div.container-fluid.content-header-wrapper.profile-header-wrapper > div > div > div > div > div.company-status > div.company-status-label.mod-active"
        )
      );

      let companyNumber = nullCheck(
        document.querySelector(
          "#details > div > div.widget-content > div:nth-child(1) > div:nth-child(1) > dl > dd:nth-child(4)"
        )
      );

      let type = nullCheck(
        document.querySelector(
          "#details > div > div.widget-content > div:nth-child(1) > div:nth-child(1) > dl > dd:nth-child(6)"
        )
      );
      let incorporation = nullCheck(
        document.querySelector(
          "#details > div > div.widget-content > div:nth-child(1) > div:nth-child(1) > dl > dd:nth-child(8)"
        )
      );

      let address = nullCheck(
        document.querySelector(
          "#details > div > div.widget-content > div:nth-child(4) > div.col-6.mobile-full-width"
        )
      );

      let nature = nullCheck(
        document.querySelector(
          "#details > div > div.widget-content > div:nth-child(2) > div:nth-child(2) > dl > dd"
        )
      );

      let turnover = nullCheck(
        document.querySelector(
          "#widget-tab-contents > div > div.col-s-12 > div > div > div > div:nth-child(1) > p > span"
        )
      );

      let netAssets = nullCheck(
        document.querySelector(
          "#widget-tab-contents > div > div.col-s-12 > div > div > div > div:nth-child(2) > p > span"
        )
      );

      return {
        name,
        status,
        companyNumber,
        type,
        incorporation,
        address,
        nature,
        turnover,
        netAssets
      };
    });

    await page.goto(
      `https://beta.companieshouse.gov.uk/company/${companyDetails.companyNumber}/persons-with-significant-control`,
      { waitUntil: "networkidle2" }
    );

    let psc = await page.evaluate(() => {
      const pscTotal = parseInt(
        document.querySelector("#company-pscs").innerText.slice(0)
      );

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

    companyDetails.psc = psc.pscDetails;

    console.log(companyDetails);

    let details = `${companyDetails.name} is a ${companyDetails.status} company.  companyUK registered ${company.type} which was incorporated on ${company.incorporation} (${company.number}). The company status
    is ${company.status}. The registered address for this entity is: ${company.address}. The UK is a low risk jurisdiction. ${company.natureOfBusiness}. ${company.psc}`;

    res.json({ details });
  } catch (e) {
    console.log(e);
    res.json({
      details: "Something went wrong. Please try again."
    });
  }
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "duedil.html"));
});

module.exports = router;
