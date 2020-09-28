import express from "express";
import pg from "pg";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get preferences
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.params;
    const client = await pool.connect();
    client.query("SELECT * FROM preferences WHERE user_id=$1", [userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})
router.get("/:key", async (req, res) => {
    const userId = req.query.userId;
    const key = req.params.key;
    const client = await pool.connect();
    pool.query("SELECT * FROM preferences WHERE user_id=$1 AND preference_value=$2", [userId, key], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})

// Add preference
router.post("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.body;
    const client = await pool.connect();
    client.query(`INSERT INTO preferences( user_id, preference_key, preference_value )
        VALUES($1, $2, $3)
        RETURNING id;`,
    [userId, b.key, b.value],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})

// Edit preference
router.put("/:key", async (req, res) => {
    const userId = req.query.userId;
    const key = req.params.key;
    const b = req.body;
    const client = await pool.connect();
    client.query(`UPDATE preferences SET preference_key = $3 preference_value = $4
        WHERE preference_key = $3 AND user_id = $1
        RETURNING id;`,
    [userId, key, b.value],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
     });
});

// Delete preference
router.delete("/:key", async (req, res) => {
    const userId = req.query.userId;
    const key = req.params.key;
    const client = await pool.connect();
    client.query(`DELETE FROM preferences
        WHERE   user_id = $1
        AND     preference_key = $2`,
    [userId, key],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
});