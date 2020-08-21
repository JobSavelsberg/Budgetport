import express from "express";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get transactions
router.get("/", async (req, res) => {
    const b = req.body;
    pool.query("SELECT * FROM transactions WHERE user_id=$1", [b.userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})
router.get("/:id", async (req, res) => {
    const b = req.body;
    pool.query("SELECT * FROM transactions WHERE user_id=$1 AND id=$2", [b.userId, b.id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Add transaction
router.post("/", async (req, res) => {
    const b = req.body;
    console.log(b);
    pool.query(`INSERT INTO transactions( user_id, deposit, date, payee, category_group, category, memo, inflow, outflow )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;`,
    [b.userId, b.deposit, b.date, b.payee, b.categoryGroup, b.category, b.memo, b.inflow, b.outflow],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Edit transaction
router.put("/:id", async (req, res) => {
    const b = req.body;
    pool.query(`UPDATE transactions SET deposit = $3, date = $4, payee = $5, category_group = $6, category = $7, memo = $8, inflow = $9, outflow = $10
        WHERE id = $2 AND user_id = $1
        RETURNING id;`,
    [b.userId, b.id, b.deposit, b.date, b.payee, b.categoryGroup, b.category, b.memo, b.inflow, b.outflow],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
     });
});

// Delete transaction
router.delete("/:id", async (req, res) => {
    const b = req.body;
    pool.query(`DELETE FROM transactions
        WHERE   user_id = $1
        AND     id = $2`,
    [b.userId, b.id],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
});