import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {router as transactionsAPI} from "./routes/api/transactionsAPI";
import {router as budgetsAPI} from "./routes/api/budgetsAPI";

//import budgetsAPI from "./routes/api/budgetsAPI";

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

app.listen(port, () => console.log(`Server started on: http://localhost:${port}`))