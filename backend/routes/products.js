const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

// Get products, with optional ?q=search
router.get('/', auth, async (req, res) => {
  try {
    const q = req.query.q ? '%' + req.query.q + '%' : '%';
    const [rows] = await db.query('SELECT * FROM products WHERE name LIKE ? OR sku LIKE ? OR category LIKE ? ORDER BY created_at DESC', [q,q,q]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({error:'Server error'}); }
});

// Create product
router.post('/', auth, async (req, res) => {
  try {
    const { name, sku, category, price, quantity, supplier, min_stock } = req.body;
    const [r] = await db.query('INSERT INTO products (name,sku,category,price,quantity,supplier,min_stock) VALUES (?,?,?,?,?,?,?)', [name,sku,category,price||0,quantity||0,supplier||null,min_stock||5]);
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({error:'Server error'}); }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, category, price, quantity, supplier, min_stock } = req.body;
    await db.query('UPDATE products SET name=?,sku=?,category=?,price=?,quantity=?,supplier=?,min_stock=? WHERE id=?', [name,sku,category,price,quantity,supplier,min_stock,id]);
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({error:'Server error'}); }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success:true });
  } catch (err) { console.error(err); res.status(500).json({error:'Server error'}); }
});

// Export products CSV
router.get('/export/csv', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY name');
    const filePath = path.join(__dirname, '..', 'tmp_products.csv');
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        {id:'id', title:'ID'},
        {id:'name', title:'Name'},
        {id:'sku', title:'SKU'},
        {id:'category', title:'Category'},
        {id:'price', title:'Price'},
        {id:'quantity', title:'Quantity'},
        {id:'supplier', title:'Supplier'}
      ]
    });
    await csvWriter.writeRecords(rows);
    res.download(filePath);
  } catch (err) { console.error(err); res.status(500).json({error:'Server error'}); }
});

// Low stock alerts
router.get('/alerts/low-stock', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE quantity <= min_stock ORDER BY quantity ASC');
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({error:'Server error'}); }
});

module.exports = router;
