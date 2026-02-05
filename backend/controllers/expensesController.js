const db = require('../config/db');

exports.addExpense = async (req, res) => {
  console.log('Received expense data:', req.body);
  const { description, amount, date } = req.body;
  if (!description || !amount || !date) {
    console.log('Missing fields:', { description, amount, date });
    return res.status(400).json({ success: false, message: 'All fields required' });
  }
  try {
    await db.query('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)', [description, amount, date]);
    console.log('Expense added successfully');
    res.json({ success: true, message: 'EXPENSE ADDED SUCCESSFULLY' });
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getCashFlow = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json({ cashflow: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
