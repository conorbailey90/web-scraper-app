const express = require("express");
const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  res.render("index2", { isLogged: req.isLogged });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    req.isLogged = true;
    return next();
  }
  req.isLogged = false;
  next();
}

module.exports = router;
