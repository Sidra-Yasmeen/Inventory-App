const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Dashboard summary report (enhanced)
router.get('/summary', auth, async (req, res) => {
  try {
    // 1️⃣ Total stock value
    const [[{ total_value }]] = await db.query(`
      SELECT IFNULL(SUM(price * quantity), 0) AS total_value FROM products
    `);

    // 2️⃣ Total products
    const [[{ total_products }]] = await db.query(`
      SELECT COUNT(*) AS total_products FROM products
    `);

    // 3️⃣ Low-stock products list
    const [low_stock_products] = await db.query(`
      SELECT id, name, category, quantity, min_stock 
      FROM products 
      WHERE quantity <= min_stock
      ORDER BY quantity ASC
      LIMIT 10
    `);

    // 4️⃣ Recent sales (last 7 days)
    const [[{ recent_sales }]] = await db.query(`
      SELECT IFNULL(SUM(total_price), 0) AS recent_sales
      FROM sales
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    // 5️⃣ Monthly sales data for chart (last 12 months)
    const [monthly_sales] = await db.query(`
      SELECT 
        DATE_FORMAT(date, '%b %Y') AS month,
        SUM(total_price) AS amount,
        SUM(qty) AS units
      FROM sales
      GROUP BY DATE_FORMAT(date, '%Y-%m')
      ORDER BY MIN(date) ASC
      LIMIT 12
    `);

    res.json({
      total_value: total_value || 0,
      total_products: total_products || 0,
      low_stock_products: low_stock_products || [],
      recent_sales: recent_sales || 0,
      monthly_sales: monthly_sales || []
    });

  } catch (err) {
    console.error('Error fetching report summary:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
