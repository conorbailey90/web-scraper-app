const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const getCompanies = (request, response) => {
  pool.query("SELECT * FROM companies", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addCompany = (request, response) => {
  const {
    companyNumber,
    CompanyName,
    companySummary,
    lastUpdated
  } = request.body;

  pool.query(
    "INSERT INTO companies (company_number, company_name, summary, date_updated ) VALUES ($1, $2, $3, $4)",
    [companyNumber, CompanyName, companySummary, lastUpdated],
    error => {
      if (error) {
        throw error;
      }
      response.status(201).json({ status: "success", message: "User added." });
    }
  );
};

app
  .route("/cunt")
  // GET endpoint
  .get(getCompanies)
  // POST endpoint
  .post(addCompany);

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`);
});
