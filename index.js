const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
var bodyParser = require("body-parser");

const app = express();

// Body parser is use to obain the input from the form in the index.html page.
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  let website = req.body.URL;
  console.log(website);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(website, { waitUntil: "networkidle2" });

  let company = await page.evaluate(() => {
    let name = document.querySelector(
      "#content-container > div.company-header > p.heading-xlarge"
    ).innerText;
    let number = document.querySelector("#company-number > strong").innerText;
    let incorporation = document.querySelector("#company-creation-date")
      .innerText;
    let status = document.querySelector("#company-status").innerText;
    let address = document.querySelector("#content-container > dl > dd")
      .innerText;
    return {
      name,
      number,
      incorporation,
      status,
      address
    };
  });
  await console.log(company);
  await page.screenshot({ path: "CompaniesHouse.png" });
  await browser.close();

  //   let details = `${company.name}  are domciled in the UK at the following address: ${company.address} `;
  //   res.send(details);
  res.json(company);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
