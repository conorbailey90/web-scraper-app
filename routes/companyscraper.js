const puppeteer = require("puppeteer");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let company = req.body.companyName;
    console.log(company);
    let website = "https://www.google.com";

    let time = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    let dayOfAccess = `${time.getDate()} ${
      monthNames[time.getMonth()]
    } ${time.getFullYear()}`;
    console.log(dayOfAccess);

    const browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 2000 },
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process"
      ]
      // headless: false
    });
    const page = await browser.newPage();

    await page.goto(website, { waitUntil: "networkidle2" });

    let google = await page.evaluate(company => {
      let input = document.querySelector(
        "#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input"
      );
      input.value = `"${company}"`;

      return;
    }, company);

    await page.evaluate(() => {
      document
        .querySelector(
          "#tsf > div:nth-child(2) > div.A8SBwf > div.FPdoLc.tfB0Bf > center > input.gNO89b"
        )
        .click();
    });
    await page.waitForNavigation();

    await page.evaluate(dayOfAccess => {
      let dateDiv = document.createElement("div");
      dateDiv.style.position = "absolute";
      dateDiv.style.top = 0;
      dateDiv.style.left = "50%";
      dateDiv.style.width = "50%";
      dateDiv.style.height = "80px";
      dateDiv.style.color = "white";
      dateDiv.style.background = "black";
      dateDiv.style.zIndex = 9999;
      dateDiv.style.padding = "5px";
      document.body.appendChild(dateDiv);
      dateDiv.innerHTML = `<p>Date: ${dayOfAccess}</p>`;
    }, dayOfAccess);

    await page.screenshot({ path: "./public/google.png" });

    let links = await page.evaluate(() => {
      let pages = Array.from(document.querySelectorAll(".rc"));

      let pageLinks = pages.map(page => {
        return page.children[0].children[0].href;
      });
      return pageLinks;
    });
    // { waitUntil: "networkidle2" }
    await page.goto(links[0], { waitUntil: "load", timeout: 0 });

    await page.evaluate(dayOfAccess => {
      let dateDiv = document.createElement("div");
      dateDiv.style.position = "absolute";
      dateDiv.style.top = 0;
      dateDiv.style.left = "50%";
      dateDiv.style.width = "50%";
      dateDiv.style.height = "80px";
      dateDiv.style.color = "white";
      dateDiv.style.background = "black";
      dateDiv.style.zIndex = 9999;
      dateDiv.style.padding = "5px";
      document.body.appendChild(dateDiv);
      dateDiv.innerHTML = `<p>Date: ${dayOfAccess}</p> <p>Address: ${location.href}</p>`;
    }, dayOfAccess);

    await page.screenshot({
      path: "./public/link1.png"
      // fullPage: true
    });
    await page.goto(links[1], { waitUntil: "load", timeout: 0 });

    await page.evaluate(dayOfAccess => {
      let dateDiv = document.createElement("div");
      dateDiv.style.position = "absolute";
      dateDiv.style.top = 0;
      dateDiv.style.left = "50%";
      dateDiv.style.width = "50%";
      dateDiv.style.height = "80px";
      dateDiv.style.color = "white";
      dateDiv.style.background = "black";
      dateDiv.style.zIndex = 9999;
      dateDiv.style.padding = "5px";
      document.body.appendChild(dateDiv);
      dateDiv.innerHTML = `<p>Date: ${dayOfAccess}</p> <p>Address: ${location.href}</p>`;
    }, dayOfAccess);

    await page.screenshot({
      path: "./public/link2.png"
      // fullPage: true
    });
    await page.goto(links[2], { waitUntil: "load", timeout: 0 });

    await page.evaluate(dayOfAccess => {
      let dateDiv = document.createElement("div");
      dateDiv.style.position = "absolute";
      dateDiv.style.top = 0;
      dateDiv.style.left = "50%";
      dateDiv.style.width = "50%";
      dateDiv.style.height = "80px";
      dateDiv.style.color = "white";
      dateDiv.style.background = "black";
      dateDiv.style.zIndex = 9999;
      dateDiv.style.padding = "5px";
      document.body.appendChild(dateDiv);
      dateDiv.innerHTML = `<p>Date: ${dayOfAccess}</p> <p>${location.href}</p>`;
    }, dayOfAccess);

    await page.screenshot({
      path: "./public/link3.png"
      // fullPage: true
    });
    await page.goto(links[3], { waitUntil: "load", timeout: 0 });

    await page.evaluate(dayOfAccess => {
      let dateDiv = document.createElement("div");
      dateDiv.style.position = "absolute";
      dateDiv.style.top = 0;
      dateDiv.style.left = "50%";
      dateDiv.style.width = "50%";
      dateDiv.style.height = "80px";
      dateDiv.style.color = "white";
      dateDiv.style.background = "black";
      dateDiv.style.zIndex = 9999;
      dateDiv.style.padding = "5px";
      document.body.appendChild(dateDiv);
      dateDiv.innerHTML = `<p>Date: ${dayOfAccess}</p> <p>Address: ${location.href}</p>`;
    }, dayOfAccess);

    await page.screenshot({
      path: "./public/link4.png"
      // fullPage: true
    });
    await page.goto(links[4], { waitUntil: "load", timeout: 0 });

    await page.evaluate(dayOfAccess => {
      let dateDiv = document.createElement("div");
      dateDiv.style.position = "absolute";
      dateDiv.style.top = 0;
      dateDiv.style.left = "50%";
      dateDiv.style.width = "50%";
      dateDiv.style.height = "80px";
      dateDiv.style.color = "white";
      dateDiv.style.background = "black";
      dateDiv.style.zIndex = 9999;
      dateDiv.style.padding = "5px";
      document.body.appendChild(dateDiv);
      dateDiv.innerHTML = `<p>Date: ${dayOfAccess}</p> <p>Address: ${location.href}</p>`;
    }, dayOfAccess);

    await page.screenshot({
      path: "./public/link5.png"
      // fullPage: true
    });

    // await page.goto("https://www.dowjones.com/products/risk-compliance/", {
    //   waitUntil: "load",
    //   timeout: 0
    // });

    // let loginPage = await page.evaluate(() => {
    //   let link = document.querySelector(
    //     "body > div.page-wrapper > header > div > div.header-right > div > div > div > ul > li:nth-child(5) > div > div > h3 > a"
    //   ).href;
    //   return link;
    // });
    // await page.goto(loginPage, {
    //   waitUntil: "networkidle2"
    // });

    // await page.evaluate(() => {
    //   let email = document.querySelector("#email");
    //   email.value = "conor.bailey@santandergcb.com";
    //   let password = document.querySelector(".password");
    //   password.value = "Zildjian01";
    //   let link = document.querySelector(
    //     "#card-sign-in > form > div > div:nth-child(7) > div > button"
    //   );
    //   link.click();
    // });

    // await page.waitForSelector("#chkAM");
    // await page.waitForSelector("#txtName");
    // await page.waitForSelector("#btn10012");

    // await page.evaluate(company => {
    //   document.querySelector("#chkAM").click();
    //   document.querySelector("#txtName").value = company;
    //   document.querySelector("#btn10012").click();
    // }, company);

    // await page.waitForNavigation();

    // await page.evaluate(dayOfAccess => {
    //   let dateDiv = document.createElement("div");
    //   dateDiv.style.position = "absolute";
    //   dateDiv.style.top = 0;
    //   dateDiv.style.left = "50%";
    //   dateDiv.style.width = "50%";
    //   dateDiv.style.height = "3rem";
    //   dateDiv.style.color = "white";
    //   dateDiv.style.background = "black";
    //   dateDiv.style.zIndex = 9999;
    //   dateDiv.style.padding = "5px";
    //   document.body.appendChild(dateDiv);
    //   dateDiv.innerHTML = `<p>Date: ${dayOfAccess}</p> <p>Address: ${location.href}</p>`;
    // }, dayOfAccess);

    // await page.waitForFunction(
    //   "document.querySelector('#loading1').style.display == 'none'"
    // );

    // await page.screenshot({
    //   path: "./public/dowjones.png"
    //   // fullPage: true
    // });
    // console.log(links);

    await browser.close();
    res.json({
      links
    });
  } catch (e) {
    console.log(e);
    res.json({
      links: "Something went wrong. Please try again."
    });
  }
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "companyss.html"));
});

module.exports = router;
