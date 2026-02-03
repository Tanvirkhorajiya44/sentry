const db = require('./config/db');

async function createDispatchTable() {
  try {
    console.log('Creating dispatchProduct table...');
    
    // Create the dispatchProduct table
    await db.query(`
      CREATE TABLE IF NOT EXISTS dispatchProduct (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        rate DECIMAL(10,2) NOT NULL,
        date DATE NOT NULL,
        batch VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        party_name VARCHAR(255) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        dispatch_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for better performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_dispatch_product_name ON dispatchProduct(product_name)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_dispatch_batch ON dispatchProduct(batch)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_dispatch_location ON dispatchProduct(location)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_dispatch_date ON dispatchProduct(date)');
    
    console.log('✅ dispatchProduct table created successfully!');
    console.log('✅ Indexes created successfully!');
    
    // Test the table
    const [rows] = await db.query('SELECT COUNT(*) as count FROM dispatchProduct');
    console.log(`📊 Current records in dispatchProduct table: ${rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error creating dispatchProduct table:', error.message);
  } finally {
    process.exit(0);
  }
}

createDispatchTable();
