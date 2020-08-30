DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS deposits;

-- Creates deposits table
CREATE TABLE IF NOT EXISTS deposits (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , name varchar(50) NOT NULL
);

-- Creates categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , category_group varchar(50) NOT NULL
    , category varchar(50) NOT NULL
    , color varchar(6) NOT NULL
);

-- Creates transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , deposit_id INT NOT NULL
    , FOREIGN KEY(deposit_id) REFERENCES deposits(id)
    , date varchar(10) NOT NULL
    , payee varchar(50) NULL 
    , category_id INT NOT NULL
    , FOREIGN KEY(category_id) REFERENCES categories(id)
    , memo varchar(128) NULL
    , inflow decimal(15,2) NULL
    , outflow decimal(15,2) NULL
);

-- Creates budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , month varchar(7) NOT NULL
    , category_id INT NOT NULL
    , FOREIGN KEY(category_id) REFERENCES categories(id)
    , budgeted decimal(15,2) NULL
);

-- Creates goals table
CREATE TABLE IF NOT EXISTS goals (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id varchar(50) NOT NULL
    , category_id INT NOT NULL
    , FOREIGN KEY(category_id) REFERENCES categories(id)
    , goal_type varchar(50) NOT NULL
    , goal_date varchar(10) NULL
    , goal_amount decimal(15,2) NOT NULL
);