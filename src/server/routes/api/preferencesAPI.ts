import express from "express";
import pg from "pg";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get preferences
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.params;
    pool.query("SELECT * FROM preferences WHERE user_id=$1", [userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})
router.get("/:key", async (req, res) => {
    const userId = req.query.userId;
    const key = req.params.key;
    pool.query("SELECT * FROM preferences WHERE user_id=$1 AND preference_value=$2", [userId, key], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Add preference
router.post("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.body;
    console.log(b);
    pool.query(`INSERT INTO preferences( user_id, preference_key, preference_value )
        VALUES($1, $2, $3)
        RETURNING id;`,
    [userId, b.key, b.value],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
})

// Edit preference
router.put("/:key", async (req, res) => {
    const userId = req.query.userId;
    const key = req.params.key;
    const b = req.body;
    pool.query(`UPDATE preferences SET preference_key = $3 preference_value = $4
        WHERE preference_key = $3 AND user_id = $1
        RETURNING id;`,
    [userId, key, b.value],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
     });
});

// Delete preference
router.delete("/:key", async (req, res) => {
    const userId = req.query.userId;
    const key = req.params.key;
    pool.query(`DELETE FROM preferences
        WHERE   user_id = $1
        AND     preference_key = $2`,
    [userId, key],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
});