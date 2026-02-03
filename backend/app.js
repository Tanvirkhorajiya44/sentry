const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');

const inventoryRoutes = require('./routes/inventory');
const godownRoutes = require('./routes/godown');
const customerSupplierRoutes = require('./routes/customerSupplier');
const expensesRoutes = require('./routes/expenses');
const reportsRoutes = require('./routes/reports');
const stockRoutes = require('./routes/stock');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple password-only login
const PASSWORD = 'admin123'; // Change this in production

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

app.get('/api/test-db', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ success: true, message: 'Database connected!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection failed', error: err.message });
  }
});

app.get('/api/test-expenses-table', async (req, res) => {
  try {
    const [rows] = await db.query('DESCRIBE expenses');
    res.json({ success: true, tableStructure: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error checking expenses table', error: err.message });
  }
});

// Test endpoint to verify backend is working
app.post('/api/test-dispatch', (req, res) => {
  console.log('Test dispatch endpoint hit with body:', req.body);
  res.json({ success: true, message: 'Test endpoint working', receivedData: req.body });
});

app.use('/api/inventory', inventoryRoutes);
app.use('/api/godown', godownRoutes);
app.use('/api/customersuppliers', customerSupplierRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/stock', stockRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
