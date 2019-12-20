const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 2000 },
    // args: ["--no-sandbox"]
    headless: false
  });
  const page = await browser.newPage();

  await page.goto("https://www.dowjones.com/products/risk-compliance/", {
    waitUntil: "networkidle2"
  });

  await page.evaluate(() => {
    document
      .querySelector(
        "body > div.page-wrapper > header > div > div.header-right > div > div > div > ul > li:nth-child(5) > div > div > h3 > a"
      )
      .click();
  });
  await page.waitForNavigation();

  await page.evaluate(() => {
    console.log("this works");
    setTimeout(() => {
      let email = document.querySelector("#email");
      email.value = "conor.bailey@santandergcb.com";
      let password = document.querySelector(".password");
      password.value = "Zildjian01";
      document
        .querySelector(
          "#card-sign-in > form > div > div:nth-child(7) > div > button"
        )
        .click();
    }, 4000);
  });
  await page.waitForNavigation();

  await page.evaluate(company => {
    document.querySelector("#chkAM").click();
    document.querySelector("#txtName").value = company;
    document.querySelector("#btn10012").click();
  }, company);

  await page.waitForNavigation();

  await page.screenshot({
    path: "./public/companyss/dowjones.png"
    // fullPage: true
  });

  await browser.close();
})();
