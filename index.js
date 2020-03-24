const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const { pool } = require("./config");
const db = require("./queries");

const app = express();

// Body parser is use to obtain the input from the form in the index.html page.
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(express.static("public"));
app.use(bodyParser.json());

app.set("view engine", "ejs");

// Routes
app.use("/", require("./routes/home"));
app.use("/companies/", require("./routes/chscraper.js"));
app.use("/duedil/", require("./routes/duedil"));
app.use("/opencorporates/", require("./routes/opencorporates"));
app.use("/companieshouse/", require("./routes/companieshouse"));
app.use("/database", require("./routes/companyDatabase"));
app.get("/test", db.getCompanies);

// Allows the use of all files in the Static folder.
app.use(express.static("public"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
