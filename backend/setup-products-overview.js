const db = require('./config/db');

async function setupProductsOverview() {
  try {
    console.log('Setting up products overview system...');
    
    // Ensure dispatchProduct table exists
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
    
    // Ensure products table has created_at column
    try {
      await db.query('ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log('✅ Added created_at column to products table');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('✅ created_at column already exists in products table');
      } else {
        throw err;
      }
    }
    
    // Create indexes for better performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_dispatch_product_name ON dispatchProduct(product_name)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_dispatch_batch ON dispatchProduct(batch)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_dispatch_location ON dispatchProduct(location)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_dispatch_date ON dispatchProduct(date)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at)');
    
    console.log('✅ All indexes created successfully!');
    
    // Test the query that will be used
    const [testRows] = await db.query(`
      SELECT 
        p.id,
        p.name as product_name,
        p.quantity,
        p.rate,
        p.date,
        p.batch,
        p.location,
        p.party,
        p.created_at,
        CASE 
          WHEN d.id IS NOT NULL THEN 'DISPATCHED'
          ELSE 'AVAILABLE'
        END as dispatch_status,
        d.dispatch_date,
        d.total_amount as dispatch_amount
      FROM products p
      LEFT JOIN dispatchProduct d ON p.name = d.product_name 
        AND p.batch = d.batch 
        AND p.location = d.location
        AND p.date = d.date
      ORDER BY p.created_at DESC
      LIMIT 5
    `);
    
    console.log(`✅ Products overview query test successful! Found ${testRows.length} products`);
    
    if (testRows.length > 0) {
      console.log('Sample product data:');
      testRows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.product_name} - Status: ${row.dispatch_status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error setting up products overview:', error.message);
  } finally {
    process.exit(0);
  }
}

setupProductsOverview();
