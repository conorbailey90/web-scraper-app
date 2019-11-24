async function scraper () {
    let website = 'https://beta.companieshouse.gov.uk/company/02294747'
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(website, { waitUntil: 'networkidle2' });

    let company = await page.evaluate(()=>{
    let name = document.querySelector("#content-container > div.company-header > p.heading-xlarge").innerText;
    let address = document.querySelector("#content-container > dl > dd").innerText;
    return {
        name,
        address
    }
  });
  await console.log(company);
  const dataBtn = document.querySelector('.get-data');

  await page.screenshot({path: 'CompaniesHouse.png'});
  await browser.close();
  
  return company;

};

module.exports =  scraper ;


// (async () => {
//     let website = 'https://beta.companieshouse.gov.uk/company/02294747'
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto(website, { waitUntil: 'networkidle2' });

//     let company = await page.evaluate(()=>{
//     let name = document.querySelector("#content-container > div.company-header > p.heading-xlarge").innerText;
//     let address = document.querySelector("#content-container > dl > dd").innerText;
//     return {
//         name,
//         address
//     }
//   });
//   await console.log(company);
//   await document.body.innerHTML = company;
//   await page.screenshot({path: 'CompaniesHouse.png'});
//   await browser.close();
  
//   return company;

// })();