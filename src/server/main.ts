import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {router as transactionsAPI} from "./routes/api/transactionsAPI";
import {router as budgetsAPI} from "./routes/api/budgetsAPI";
import {router as categoriesAPI} from "./routes/api/categoriesAPI";
import {router as depositsAPI} from "./routes/api/depositsAPI";
import {router as preferencesAPI} from "./routes/api/preferencesAPI";
import path from "path"
import serveStatic from 'serve-static'
import history from 'connect-history-api-fallback';

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
app.use("/api/preferences", preferencesAPI);


// Support history api 
app.use(history({
     verbose: true
}));

// 2nd call for redirected requests
app.use(express.static(path.join(__dirname, '../../build/client')));

app.listen(port, () => console.log(`Server started on: http://localhost:${port}`))