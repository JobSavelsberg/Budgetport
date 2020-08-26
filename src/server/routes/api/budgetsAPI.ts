import express from "express";
import pg from "pg";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get budgets
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.params;
    pool.query("SELECT * FROM budgets WHERE user_id=$1", [userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})
router.get("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    pool.query("SELECT * FROM budgets WHERE user_id=$1 AND id=$2", [userId, id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Add budget
router.post("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.body;
    console.log(b);
    pool.query(`INSERT INTO budgets( user_id, month, category_id, budgeted )
        VALUES($1, $2, $3, $5)
        RETURNING id;`,
    [userId, b.month, b.categoryId, b.budgeted],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Edit budget
router.put("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const b = req.body;
    pool.query(`UPDATE budgets SET month = $3, category_group = $4, inflow = $5, outflow = $6
        WHERE id = $2 AND user_id = $1
        RETURNING id;`,
    [userId, id, b.month, b.categoryId, b.budgeted],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
     });
});

// Delete budget
router.delete("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    pool.query(`DELETE FROM budgets
        WHERE   user_id = $1
        AND     id = $2`,
    [userId, id],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
});