import express from "express";
import pg from "pg";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get budgets
router.get("/", async (req, res) => {
    const b = req.body;
    pool.query("SELECT * FROM budgets WHERE user_id=$1", [b.userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})
router.get("/:id", async (req, res) => {
    const b = req.body;
    pool.query("SELECT * FROM budgets WHERE user_id=$1 AND id=$2", [b.userId, b.id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Add budget
router.post("/", async (req, res) => {
    const b = req.body;
    console.log(b);
    pool.query(`INSERT INTO budgets( user_id, month, category_group, category, budgeted )
        VALUES($1, $2, $3, $4, $5)
        RETURNING id;`,
    [b.userId, b.month, b.categoryGroup, b.category, b.budgeted],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Edit budget
router.put("/:id", async (req, res) => {
    const b = req.body;
    pool.query(`UPDATE budgets SET month = $3, category_group = $4, category = $5, inflow = $6, outflow = $7
        WHERE id = $2 AND user_id = $1
        RETURNING id;`,
    [b.userId, b.id, b.month, b.categoryGroup, b.category, b.budgeted],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
     });
});

// Delete budget
router.delete("/:id", async (req, res) => {
    const b = req.body;
    pool.query(`DELETE FROM budgets
        WHERE   user_id = $1
        AND     id = $2`,
    [b.userId, b.id],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
});