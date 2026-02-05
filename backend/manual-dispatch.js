const db = require('./config/db');

async function manualDispatch() {
  const conn = await db.getConnection();
  try {
    console.log('Manually dispatching a product...');
    
    await conn.beginTransaction();
    
    // Test data
    const itemName = '2*2 white titles';
    const quantity = 5;
    const rate = 100;
    const date = '2024-01-15';
    const batch = '221';
    const location = 'Godown 2';
    const party = 'Test Customer';
    const totalAmount = quantity * rate;
    
    console.log('Dispatch data:', { itemName, quantity, rate, date, batch, location, party, totalAmount });
    
    // 1. Check if stock exists
    const [stockRows] = await conn.query(
      'SELECT s.id, s.quantity, s.product_id FROM stock s JOIN products p ON s.product_id = p.id WHERE p.name = ? AND s.batch = ? AND s.location = ?',
      [itemName, batch, location]
    );
    
    console.log(`Stock check result: ${stockRows.length} records found`);
    if (stockRows.length > 0) {
      console.log(`Available stock: ${stockRows[0].quantity}`);
    }
    
    if (stockRows.length === 0) {
      console.log('❌ No stock found - cannot dispatch');
      await conn.rollback();
      return;
    }
    
    if (stockRows[0].quantity < quantity) {
      console.log(`❌ Not enough stock (need ${quantity}, have ${stockRows[0].quantity})`);
      await conn.rollback();
      return;
    }
    
    // 2. Insert into dispatchProduct table
    console.log('Inserting into dispatchProduct table...');
    await conn.query(
      'INSERT INTO dispatchProduct (product_name, quantity, rate, date, batch, location, party_name, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [itemName, quantity, rate, date, batch, location, party, totalAmount]
    );
    
    // 3. Insert into products table
    console.log('Inserting into products table...');
    const [result] = await conn.query(
      'INSERT INTO products (name, quantity, rate, date, batch, location, party) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [itemName, quantity, rate, date, batch, location, party]
    );
    const productId = result.insertId;
    console.log(`Product inserted with ID: ${productId}`);
    
    // 4. Insert into transactions
    console.log('Inserting into transactions table...');
    await conn.query(
      'INSERT INTO transactions (product_id, quantity, rate, date, batch, location, party, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [productId, quantity, rate, date, batch, location, party, 'outgoing']
    );
    
    // 5. Update stock
    console.log('Updating stock...');
    await conn.query('UPDATE stock SET quantity = quantity - ? WHERE id = ?', [quantity, stockRows[0].id]);
    
    await conn.commit();
    console.log('✅ Product dispatched successfully!');
    
    // Verify the dispatch
    const [dispatched] = await db.query('SELECT COUNT(*) as count FROM dispatchProduct');
    console.log(`📊 DispatchProduct table now has: ${dispatched[0].count} records`);
    
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error dispatching product:', err.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

manualDispatch();
