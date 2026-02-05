const db = require('../config/db');

exports.addProduct = async (req, res) => {
  const { itemName, quantity, rate, date, batch, location, party } = req.body;
  if (!itemName || !quantity || !rate || !date || !batch || !location || !party) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Insert into products table with all fields
    await conn.query(
      'INSERT INTO products (name, quantity, rate, date, batch, location, party) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [itemName, quantity, rate, date, batch, location, party]
    );
    // Also insert into transactions for tracking
    const [result] = await conn.query('SELECT LAST_INSERT_ID() as id');
    await conn.query(
      'INSERT INTO transactions (product_id, quantity, rate, date, batch, location, party, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [result[0].id, quantity, rate, date, batch, location, party, 'incoming']
    );
    // Update stock
    await conn.query(
      'INSERT INTO stock (product_id, batch, location, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
      [result[0].id, batch, location, quantity, quantity]
    );
    await conn.commit();
    res.json({ success: true, message: 'PRODUCT ADDED SUCCESSFULLY' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
};

exports.dispatchProduct = async (req, res) => {
  console.log('Dispatch request body:', req.body);
  const { itemName, quantity, rate, date, batch, location, party } = req.body;
  console.log('Extracted fields:', { itemName, quantity, rate, date, batch, location, party });
  
  // Convert quantity and rate to numbers
  const numQuantity = parseFloat(quantity);
  const numRate = parseFloat(rate);
  
  if (!itemName || !quantity || !rate || !date || !batch || !location || !party) {
    console.log('Missing fields validation failed');
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  
  if (isNaN(numQuantity) || isNaN(numRate)) {
    console.log('Invalid number format');
    return res.status(400).json({ success: false, message: 'Invalid number format' });
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    // 1. Check if stock exists for this product/batch/location
    const [stockRows] = await conn.query(
      'SELECT s.id, s.quantity, s.product_id FROM stock s JOIN products p ON s.product_id = p.id WHERE p.name = ? AND s.batch = ? AND s.location = ?',
      [itemName, batch, location]
    );
    
    if (stockRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'NO STOCK AVAILABLE FOR THIS PRODUCT/BATCH/LOCATION' });
    }
    
    if (stockRows[0].quantity < numQuantity) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'NOT ENOUGH STOCK TO DISPATCH' });
    }
    
    // 2. Insert into dispatch table (use exact table name)
    await conn.query(
      'INSERT INTO dispatchproduct (product_name, quantity, rate, date, batch, location, party_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [itemName, numQuantity, numRate, date, batch, location, party]
    );

    // 3. Record outgoing transaction against existing product
    const existingProductId = stockRows[0].product_id;
    await conn.query(
      'INSERT INTO transactions (product_id, quantity, rate, date, batch, location, party, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [existingProductId, numQuantity, numRate, date, batch, location, party, 'outgoing']
    );

    // 4. Update stock (subtract quantity). If goes to zero, keep row for history.
    await conn.query('UPDATE stock SET quantity = quantity - ? WHERE id = ?', [numQuantity, stockRows[0].id]);

    // 5. Also decrement the original product's quantity so overview reflects remaining qty
    const productIdForUpdate = stockRows[0].product_id;
    await conn.query(
      'UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE id = ?',[numQuantity, productIdForUpdate]
    );
    
    await conn.commit();
    res.json({ success: true, message: 'PRODUCT DISPATCHED SUCCESSFULLY' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
};

exports.listProducts = async (req, res) => {
  try {
    // Get all products with dispatch status
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name as product_name,
        -- available = initial - dispatched (aggregate by product/batch/location irrespective of dates)
        GREATEST(
          p.quantity - COALESCE((
            SELECT SUM(dp.quantity)
            FROM dispatchproduct dp
            WHERE dp.product_name = p.name
              AND dp.batch = p.batch
              AND dp.location = p.location
          ), 0), 0
        ) AS quantity,
        p.rate,
        p.date,
        p.batch,
        p.location,
        p.party,
        p.created_at,
        CASE WHEN (
          SELECT COALESCE(SUM(dp2.quantity), 0)
          FROM dispatchproduct dp2
          WHERE dp2.product_name = p.name
            AND dp2.batch = p.batch
            AND dp2.location = p.location
        ) > 0 THEN 'DISPATCHED' ELSE 'AVAILABLE' END AS dispatch_status,
        (SELECT MAX(dp3.date)
         FROM dispatchproduct dp3
         WHERE dp3.product_name = p.name AND dp3.batch = p.batch AND dp3.location = p.location
        ) AS dispatch_date
      FROM products p
      ORDER BY p.created_at DESC
    `);
    
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Error fetching products', error: err.message });
  }
};

exports.getDispatchedProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM dispatchproduct ORDER BY date DESC'
    );
    res.json({ success: true, dispatchedProducts: rows });
  } catch (err) {
    console.error('Error fetching dispatched products:', err);
    res.status(500).json({ success: false, message: 'Error fetching dispatched products', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { itemName, quantity, rate, date, batch, location, party } = req.body;
  
  if (!itemName || !quantity || !rate || !date || !batch || !location || !party) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  
  try {
    const numQuantity = parseFloat(quantity);
    const numRate = parseFloat(rate);
    
    if (isNaN(numQuantity) || isNaN(numRate)) {
      return res.status(400).json({ success: false, message: 'Invalid number format' });
    }
    
    await db.query(
      'UPDATE products SET name = ?, quantity = ?, rate = ?, date = ?, batch = ?, location = ?, party = ? WHERE id = ?',
      [itemName, numQuantity, numRate, date, batch, location, party, id]
    );
    
    res.json({ success: true, message: 'PRODUCT UPDATED SUCCESSFULLY' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Error updating product', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if product has been dispatched
    const [product] = await db.query('SELECT name, batch, location, date FROM products WHERE id = ?', [id]);
    
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const productData = product[0];
    
    // Check if this product has been dispatched
    const [dispatched] = await db.query(
      'SELECT id FROM dispatchProduct WHERE product_name = ? AND batch = ? AND location = ? AND date = ?',
      [productData.name, productData.batch, productData.location, productData.date]
    );
    
    if (dispatched.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'CANNOT DELETE DISPATCHED PRODUCT. Product has already been dispatched.' 
      });
    }
    
    // Delete from products table
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    
    // Also delete from stock table if exists
    await db.query(
      'DELETE FROM stock WHERE product_id = ?',
      [id]
    );
    
    // Also delete from transactions table
    await db.query(
      'DELETE FROM transactions WHERE product_id = ?',
      [id]
    );
    
    res.json({ success: true, message: 'PRODUCT DELETED SUCCESSFULLY' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Error deleting product', error: err.message });
  }
};
