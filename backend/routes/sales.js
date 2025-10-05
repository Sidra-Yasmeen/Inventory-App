const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// List sales
router.get('/', auth, async (req, res) => {
  const [rows] = await db.query('SELECT s.*, pr.name as product_name FROM sales s LEFT JOIN products pr ON s.product_id = pr.id ORDER BY s.date DESC');
  res.json(rows);
});

// Create sale (decrease stock) - simple check for stock
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, qty, total_price, customer } = req.body;
    // check stock
    const [pRows] = await db.query('SELECT quantity FROM products WHERE id = ?', [product_id]);
    if (pRows.length === 0) return res.status(400).json({ error:'Product not found' });
    const currentQty = pRows[0].quantity;
    if (currentQty < qty) return res.status(400).json({ error:'Insufficient stock' });
    await db.query('INSERT INTO sales (product_id,qty,total_price,customer) VALUES (?,?,?,?)', [product_id, qty, total_price, customer]);
    await db.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [qty, product_id]);
    res.json({ success:true });
  } catch (err) { console.error(err); res.status(500).json({error:'Server error'}); }
});

module.exports = router;
