import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { router as transactionsAPI } from "./routes/api/transactionsAPI";
import { router as budgetsAPI } from "./routes/api/budgetsAPI";
import { router as categoriesAPI } from "./routes/api/categoriesAPI";
import { router as depositsAPI } from "./routes/api/depositsAPI";
import { router as preferencesAPI } from "./routes/api/preferencesAPI";
import tokenToUID from "./routes/auth";

import path from "path"
import serveStatic from 'serve-static'
import history from 'connect-history-api-fallback';
import * as admin from 'firebase-admin';
import assert from "assert";

console.log("Starting Server")

// initialize configuration
dotenv.config();

assert(process.env.FB_PRIVATE_KEY);
const credentials = {
  type: "service_account",
  project_id: process.env.FB_PROJECT_ID,
  private_key_id: process.env.FB_PRIVATE_KEY_ID,
  private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FB_CLIENT_EMAIL,
  client_id: process.env.FB_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FB_CLIENT_CERT
}

const serviceAccount = credentials as admin.ServiceAccount
admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://budgetport-2644b.firebaseio.com"
});


const port = process.env.SERVER_PORT || 5000;

const app = express();

// Support history api 
app.use(history({
     verbose: true
}));
app.use(express.static(path.join(__dirname, '../../build/client')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(tokenToUID(admin));

app.use("/api/transactions", transactionsAPI);
app.use("/api/budgets", budgetsAPI);
app.use("/api/categories", categoriesAPI);
app.use("/api/deposits", depositsAPI);
app.use("/api/preferences", preferencesAPI);

app.listen(port, () => console.log(`Server started on: http://localhost:${port}`))