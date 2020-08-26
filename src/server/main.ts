import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {router as transactionsAPI} from "./routes/api/transactionsAPI";
import {router as budgetsAPI} from "./routes/api/budgetsAPI";
import {router as categoriesAPI} from "./routes/api/categoriesAPI";
import {router as depositsAPI} from "./routes/api/depositsAPI";


// initialize configuration
dotenv.config();
const port = process.env.SERVER_PORT || 5000;

const app = express();

// Middleware
app.use( express.json() );
app.use( express.urlencoded({ extended: true }));
app.use( cors() );

app.use("/api/transactions", transactionsAPI);
app.use("/api/budgets", budgetsAPI);
app.use("/api/categories", categoriesAPI);
app.use("/api/deposits", depositsAPI);

app.listen(port, () => console.log(`Server started on: http://localhost:${port}`))