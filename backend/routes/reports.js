const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Total stock value and simple monthly sales total report
router.get('/summary', auth, async (req, res) => {
  try {
    // Total stock value
    const [[{ total_value }]] = await db.query(
      'SELECT SUM(price * quantity) as total_value FROM products'
    );

    // Monthly sales summary (last 12 months)
    const [sales] = await db.query(`
      SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(total_price) as monthly_sales
      FROM sales
      GROUP BY DATE_FORMAT(date, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);

    res.json({
      total_value: total_value || 0,
      monthly_sales: sales
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
 