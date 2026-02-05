const db = require('../config/db');

exports.addCustomer = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name required' });
  try {
    await db.query('INSERT INTO customers (name) VALUES (?)', [name]);
    res.json({ success: true, message: 'Customer added' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.listCustomers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customers');
    res.json({ customers: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.addSupplier = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name required' });
  try {
    await db.query('INSERT INTO suppliers (name) VALUES (?)', [name]);
    res.json({ success: true, message: 'Supplier added' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.listSuppliers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers');
    res.json({ suppliers: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
