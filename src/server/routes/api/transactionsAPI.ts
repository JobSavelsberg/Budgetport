import express from "express";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get transactions
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    pool.query("SELECT * FROM transactions WHERE user_id=$1", [userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})
router.get("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const b = req.body;
    pool.query("SELECT * FROM transactions WHERE user_id=$1 AND id=$2", [userId, id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Add transaction
router.post("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.body;
    console.log(b);
    pool.query(`INSERT INTO transactions( user_id, deposit_id, date, payee, category_id, memo, inflow, outflow )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;`,
    [userId, b.depositId, b.date, b.payee, b.categoryId, b.memo, b.inflow, b.outflow],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Edit transaction
router.put("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const b = req.body;
    pool.query(`UPDATE transactions SET deposit_id = $3, date = $4, payee = $5, category_group = $6, memo = $7, inflow = $8, outflow = $9
        WHERE id = $2 AND user_id = $1
        RETURNING id;`,
    [userId, id, b.depositId, b.date, b.payee, b.categoryId, b.memo, b.inflow, b.outflow],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
     });
});

// Delete transaction
router.delete("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    pool.query(`DELETE FROM transactions
        WHERE   user_id = $1
        AND     id = $2`,
    [userId, id],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
});