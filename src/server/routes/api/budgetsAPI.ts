import express from "express";
import pg from "pg";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get budgets
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.params;
    const client = await pool.connect();
    client.query("SELECT * FROM budgets WHERE user_id=$1", [userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})
router.get("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const client = await pool.connect();
    client.query("SELECT * FROM budgets WHERE user_id=$1 AND id=$2", [userId, id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})

// Add budget
router.post("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.body;
    console.log(b);
    const client = await pool.connect();
    client.query(`INSERT INTO budgets( user_id, month, category_id, budgeted )
        VALUES($1, $2, $3, $4)
        RETURNING id;`,
    [userId, b.month, b.categoryId, b.budgeted],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})

// Edit budget
router.put("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const b = req.body;
    const client = await pool.connect();
    client.query(`UPDATE budgets SET month = $3, category_id = $4, budgeted = $5
        WHERE id = $2 AND user_id = $1
        RETURNING id;`,
    [userId, id, b.month, b.categoryId, b.budgeted],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
     });
});

// Delete budget
router.delete("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const client = await pool.connect();
    client.query(`DELETE FROM budgets
        WHERE   user_id = $1
        AND     id = $2`,
    [userId, id],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
});