const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register (simple password, no hash)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const [r] = await db.query(
      'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
      [name, email, password, role || 'staff']
    );
    res.json({ id: r.insertId, name, email, role: role || 'staff' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login (plain text check)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = rows[0];
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
