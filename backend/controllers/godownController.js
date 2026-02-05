const db = require('../config/db');

exports.addLocation = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name required' });
  try {
    await db.query('INSERT INTO godowns (name) VALUES (?)', [name]);
    res.json({ success: true, message: 'Godown added' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.listLocations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT name FROM godowns');
    res.json({ locations: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getGodownStock = async (req, res) => {
  const { location } = req.query;
  try {
    // Derive current stock from transactions to ensure accuracy
    const [rows] = await db.query(
      `SELECT 
         p.name AS product,
         t.batch,
         t.location,
         SUM(CASE WHEN t.type = 'incoming' THEN t.quantity ELSE -t.quantity END) AS quantity
       FROM transactions t
       JOIN products p ON t.product_id = p.id
       ${location ? 'WHERE t.location = ?' : ''}
       GROUP BY p.name, t.batch, t.location
       HAVING quantity > 0`,
      location ? [location] : []
    );
    res.json({ stock: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getGodownTransactions = async (req, res) => {
  const { location } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT t.id, p.name as product, t.batch, t.quantity, t.type, t.date
       FROM transactions t
       JOIN products p ON t.product_id = p.id
       WHERE t.location = ?
       ORDER BY t.date DESC, t.id DESC`,
      [location]
    );
    res.json({ transactions: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
