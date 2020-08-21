import express from "express";
import pg from "pg";

export const router = express.Router();

// Get budgets
router.get("/", (req, res) => {
    res.send("Get budget");
})
// Add budget

// Edit budget

// Delete budget

