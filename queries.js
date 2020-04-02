const { pool } = require("./config");

const getCompanies = (req, res) => {
  pool.query(
    // CREATE TABLE IF NOT EXISTS companies
    // (id BIGSERIAL PRIMARY KEY NOT NULL,
    // source VARCHAR(50) NOT NULL,
    // company_name VARCHAR(100) NOT NULL,
    // company_number VARCHAR(50) NOT NULL,
    // company_summary VARCHAR(800),
    // last_updated DATE NOT NULL,
    // UNIQUE (source, company_number))

    `SELECT company_name, company_number, source, last_updated FROM companies ORDER BY last_updated DESC`,
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      return results.rows;
      // let companies = results.rows[0];
      // return results.rows;
      res.status(200).json(results.rows);
    }
  );
};

const getCompanyById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE ID = $1", [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

const createCompany = (source, companyName, companyNumber, companySummary) => {
  // const { companyName, companyNumber, companySummary, lastUpdated } = req.body;

  pool.query(
    `INSERT INTO companies (source, company_name, company_number, company_summary, last_updated) 
    VALUES ($1, $2, $3, $4, now()::DATE )
    ON CONFLICT ON CONSTRAINT companies_source_company_number_key 
    DO UPDATE SET company_summary = $4, last_updated = now()::DATE
    RETURNING id`,
    [source, companyName, companyNumber, companySummary],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
    }
  );
};

const selectUser = (username, email) => {
  pool.query(
    `SELECT * FROM users
    WHERE username = $1
    OR email = $2`,
    [username, email],
    (err, results) => {
      if (err) {
        throw err;
      }
      if (results.rows.length > 0) {
        console.log("working");
        return true;
      }
      console.log(results.rows);
    }
  );
};

const addUser = (username, email, password) => {
  pool.query(
    `INSERT INTO users (username, email, password) 
  VALUES ($1, $2, $3)
  ON CONFLICT DO NOTHING
  RETURNING id`,
    [username, email, password],
    (err, results) => {
      if (err) {
        throw err;
      }

      console.log(results.rows);
    }
  );
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);

  const { name, email } = req.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("DELETE FROM users WHERE id = $1", [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).send(`User deleted with ID: ${id}`);
  });
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  selectUser,
  addUser,
  updateUser,
  deleteUser
};
