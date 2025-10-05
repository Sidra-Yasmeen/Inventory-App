const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// List purchases
router.get('/', auth, async (req, res) => {
  const [rows] = await db.query('SELECT p.*, pr.name as product_name FROM purchases p LEFT JOIN products pr ON p.product_id = pr.id ORDER BY p.date DESC');
  res.json(rows);
});

// Create purchase (increase stock)
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, qty, total_cost, supplier } = req.body;
    await db.query('INSERT INTO purchases (product_id,qty,total_cost,supplier) VALUES (?,?,?,?)', [product_id, qty, total_cost, supplier]);
    await db.query('UPDATE products SET quantity = quantity + ? WHERE id = ?', [qty, product_id]);
    res.json({ success:true });
  } catch (err) { console.error(err); res.status(500).json({error:'Server error'}); }
});

module.exports = router;
