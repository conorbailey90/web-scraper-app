const express = require("express");
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");

const app = express();

// Body parser is use to obain the input from the form in the index.html page.
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

// Allows the use of all files in the Static folder.
app.use(express.static("public"));

submitCount = 0; // Used to count the amount of submit button link clicks.

app.use("/", require("./routes/scraper"));
app.use("/companieshouse/", require("./routes/scraper"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
