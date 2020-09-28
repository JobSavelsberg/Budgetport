import express from "express";
import pg from "pg";
import { pool } from "./postgresWrapper";

export const router = express.Router();

// Get categories
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.params;
    const client = await pool.connect();
    client.query("SELECT * FROM categories WHERE user_id=$1", [userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})
router.get("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const client = await pool.connect();
    client.query("SELECT * FROM categories WHERE user_id=$1 AND id=$2", [userId, id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})

// Add category
router.post("/", async (req, res) => {
    const userId = req.query.userId;
    const b = req.body;
    console.log(b);
    const client = await pool.connect();
    client.query(`INSERT INTO categories( user_id, category_group, category, color)
        VALUES($1, $2, $3, $4)
        RETURNING id;`,
    [userId, b.categoryGroup, b.category, b.color],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
})

// Edit category
router.put("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const b = req.body;
    const client = await pool.connect();
    client.query(`UPDATE categories SET category_group = $3, category = $4, color = $5
        WHERE id = $2 AND user_id = $1
        RETURNING id;`,
    [userId, id, b.categoryGroup, b.category, b.color],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
     });
});

// Delete category
router.delete("/:id", async (req, res) => {
    const userId = req.query.userId;
    const id = req.params.id;
    const client = await pool.connect();
    client.query(`DELETE FROM categories
        WHERE   user_id = $1
        AND     id = $2`,
    [userId, id],
    (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
        client.release();
    });
});