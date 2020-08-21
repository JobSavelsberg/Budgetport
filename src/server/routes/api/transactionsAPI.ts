import express from "express";
import pg from "pg";

export const router = express.Router();

// Get transactions
router.get("/", (req, res) => {
    res.send("Get transaction");
})
// Add transaction

// Edit transaction

// Delete transaction

