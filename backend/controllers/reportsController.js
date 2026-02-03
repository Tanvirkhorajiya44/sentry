const db = require('../config/db');

exports.stockReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.name as product, s.batch, s.location, s.quantity
       FROM stock s
       JOIN products p ON s.product_id = p.id
       WHERE s.quantity > 0`
    );
    res.json({ stock: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.salesReport = async (req, res) => {
  // Dummy: return all outgoing transactions
  try {
    const [rows] = await db.query(
      `SELECT t.id, p.name as product, t.batch, t.quantity, t.rate, t.date, t.location, t.party
       FROM transactions t
       JOIN products p ON t.product_id = p.id
       WHERE t.type = 'outgoing'`
    );
    res.json({ sales: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.purchaseReport = async (req, res) => {
  // Dummy: return all incoming transactions
  try {
    const [rows] = await db.query(
      `SELECT t.id, p.name as product, t.batch, t.quantity, t.rate, t.date, t.location, t.party
       FROM transactions t
       JOIN products p ON t.product_id = p.id
       WHERE t.type = 'incoming'`
    );
    res.json({ purchases: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.profitLossReport = async (req, res) => {
  // Dummy: calculate profit/loss as total sales - total purchases - total expenses
  try {
    const [[{ total_sales = 0 }]] = await db.query(
      `SELECT SUM(quantity * rate) as total_sales FROM transactions WHERE type = 'outgoing'`
    );
    const [[{ total_purchases = 0 }]] = await db.query(
      `SELECT SUM(quantity * rate) as total_purchases FROM transactions WHERE type = 'incoming'`
    );
    const [[{ total_expenses = 0 }]] = await db.query(
      `SELECT SUM(amount) as total_expenses FROM expenses`
    );
    const profit = (total_sales || 0) - (total_purchases || 0) - (total_expenses || 0);
    res.json({ profit, loss: profit < 0 ? -profit : 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
