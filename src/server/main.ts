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

import firebaseAccountCredentials from './keys/serviceAccountKey.json'

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount
admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://budgetport-2644b.firebaseio.com"
});

/*admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    let uid = decodedToken.uid;
    // ...
  }).catch(function(error) {
    // Handle error
  });*/

// initialize configuration
dotenv.config();
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