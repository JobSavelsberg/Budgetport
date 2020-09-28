import express from "express";
import pg from "pg";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get deposits
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.params;
    const client = await pool.connect();
    client.query("SELECT * FROM deposits WHERE user_id=$1", [userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})
router.get("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const client = await pool.connect();
    client.query("SELECT * FROM deposits WHERE user_id=$1 AND id=$2", [userId, id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})

// Add deposit
router.post("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.body;
    console.log(b);
    const client = await pool.connect();
    client.query(`INSERT INTO deposits( user_id, name )
        VALUES($1, $2)
        RETURNING id;`,
    [userId, b.name],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})

// Edit deposit
router.put("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const b = req.body;
    const client = await pool.connect();
    client.query(`UPDATE deposits SET name = $3
        WHERE id = $2 AND user_id = $1
        RETURNING id;`,
    [userId, id, b.name],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
     });
});

// Delete deposit
router.delete("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const client = await pool.connect();
    client.query(`DELETE FROM deposits
        WHERE   user_id = $1
        AND     id = $2`,
    [userId, id],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
});