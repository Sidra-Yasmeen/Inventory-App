const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const purchaseRoutes = require('./routes/purchases');
const salesRoutes = require('./routes/sales');
const reportsRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/', (req, res) => res.json({status:'Inventory API'}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
