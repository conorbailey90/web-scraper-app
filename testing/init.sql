CREATE TABLE companies
(
    ID SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_number VARCHAR(255) NOT NULL,
    summary VARCHAR(600),
    last_updated DATE

);

-- INSERT INTO userstwo
--     (full_name, email)
-- VALUES
--     ('Conor Bailey', 'conbailey90@gmail.com');