const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next){
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error:'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error:'Invalid token' });
  }
}

module.exports = auth;
