const db = require('../config/db');

exports.listStock = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.id, p.name as product, s.batch, s.location, s.quantity
       FROM stock s
       JOIN products p ON s.product_id = p.id
       ORDER BY s.location, p.name`
    );
    res.json({ stock: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.addStock = async (req, res) => {
  const { product, batch, location, quantity } = req.body;
  if (!product || !batch || !location || !quantity) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Insert product if not exists
    let [rows] = await conn.query('SELECT id FROM products WHERE name = ? AND batch = ?', [product, batch]);
    let productId;
    if (rows.length === 0) {
      const [result] = await conn.query('INSERT INTO products (name, batch) VALUES (?, ?)', [product, batch]);
      productId = result.insertId;
    } else {
      productId = rows[0].id;
    }
    // Insert or update stock
    await conn.query(
      'INSERT INTO stock (product_id, batch, location, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [productId, batch, location, quantity, quantity]
    );
    await conn.commit();
    res.json({ success: true, message: 'Stock added' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
};

exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { product, batch, location, quantity } = req.body;
  if (!product || !batch || !location || !quantity) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }
  try {
    await db.query(
      'UPDATE stock s JOIN products p ON s.product_id = p.id SET p.name = ?, s.batch = ?, s.location = ?, s.quantity = ? WHERE s.id = ?',
      [product, batch, location, quantity, id]
    );
    res.json({ success: true, message: 'Stock updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteStock = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM stock WHERE id = ?', [id]);
    res.json({ success: true, message: 'Stock deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
