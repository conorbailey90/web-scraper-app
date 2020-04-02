const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./config");
const bcrypt = require("bcrypt");

function initialize(passport) {
  console.log("inititalized");
  const authenticateUser = (email, password, done) => {
    console.log(email);
    console.log(password);
    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          return done(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }

            if (isMatch) {
              console.log("reached");
              console.log(isMatch);
              return done(null, user);
            } else {
              return done(null, false, { message: "Password is incorrect" });
            }
          });
        } else {
          console.log("no fucking user");
          return done(null, false, { message: "No user with that email" });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
      if (err) {
        return done(err);
      }
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;
