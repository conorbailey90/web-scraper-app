CREATE TABLE companies
(
    ID SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_number VARCHAR(255) NOT NULL,
    summary VARCHAR(600),
    last_updated DATE

);

CREATE TABLE users
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    UNIQUE(email)
);