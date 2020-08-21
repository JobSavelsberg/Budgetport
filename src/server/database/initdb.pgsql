DROP TABLE IF EXISTS transactions;
-- Creates transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , deposit varchar(50) NULL
    , date date NOT NULL
    , payee varchar(50) NULL 
    , category_group varchar(50) NOT NULL
    , category varchar(50) NOT NULL
    , memo varchar(50) NULL
    , inflow decimal(15,2) NULL
    , outflow decimal(15,2) NULL
);

DROP TABLE IF EXISTS budgets;
-- Creates budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , month date NOT NULL
    , category_group varchar(50) NOT NULL
    , category varchar(50) NOT NULL
    , budgeted decimal(15,2) NULL
);

DROP TABLE IF EXISTS categories;
-- Creates categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , category_group varchar(50) NOT NULL
    , category varchar(50) NOT NULL
);