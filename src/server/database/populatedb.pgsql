INSERT INTO categories( user_id, category_group, category, color )
VALUES(1, 'Inflow', 'To be Budgeted', '4CAF50');
INSERT INTO categories( user_id, category_group, category, color )
VALUES(1, 'Fixed Expenses', 'Groceries', '2196F3');
INSERT INTO categories( user_id, category_group, category, color )
VALUES(1, 'Fun', 'Music', 'EF6C00');
INSERT INTO categories( user_id, category_group, category, color )
VALUES(1, 'Investing', 'Meesman', 'ABBA39');
INSERT INTO categories( user_id, category_group, category, color )
VALUES(1, 'Fixed Expenses', 'Rent', '795548');

INSERT INTO deposits( user_id, name )
VALUES(1, 'Checking');
INSERT INTO deposits( user_id, name )
VALUES(1, 'Saving');
INSERT INTO deposits( user_id, name )
VALUES(1, 'Cash');

INSERT INTO transactions( user_id, deposit_id, date, payee, category_id, memo, inflow, outflow )
VALUES(1, 1, '2020-1-1', 'Work', 1, 'Salary', 2000, 0);
INSERT INTO transactions( user_id, deposit_id, date, payee, category_id, memo, inflow, outflow )
VALUES(1, 1, '2020-3-3', 'AH', 2, 'Apples', 0, 5.96);
INSERT INTO transactions( user_id, deposit_id, date, payee, category_id, memo, inflow, outflow )
VALUES(1, 1, '2020-4-16', 'AH', 2, 'Cake', 0, 2.49);
INSERT INTO transactions( user_id, deposit_id, date, payee, category_id, memo, inflow, outflow )
VALUES(1, 1, '2020-5-3', 'Thomann', 3, 'Guitar', 0, 300);
INSERT INTO transactions( user_id, deposit_id, date, payee, category_id, memo, inflow, outflow )
VALUES(1, 2, '2020-5-28', 'Meesman', 4, 'Monthly Investment', 0, 100.00);

INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-3', 3, 200);
INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-4', 5, 400);
INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-4', 4, 100);
INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-5', 3, 500);
INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-6', 5, 600);
INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-7', 4, 400);
INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-8', 3, 500);
INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-8', 5, 600);
INSERT INTO budgets( user_id, month, category_id, budgeted )
VALUES(1, '2020-8', 4, 400);