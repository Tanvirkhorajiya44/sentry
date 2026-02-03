const db = require('./config/db');

async function checkData() {
  try {
    console.log('Checking database data...');
    
    // Check products table
    const [products] = await db.query('SELECT COUNT(*) as count FROM products');
    console.log(`📦 Products table: ${products[0].count} records`);
    
    // Check dispatchProduct table
    const [dispatched] = await db.query('SELECT COUNT(*) as count FROM dispatchProduct');
    console.log(`🚚 DispatchProduct table: ${dispatched[0].count} records`);
    
    // Show sample products
    const [sampleProducts] = await db.query('SELECT id, name, quantity, batch, location, party FROM products LIMIT 5');
    console.log('\n📋 Sample products:');
    if (sampleProducts.length > 0) {
      sampleProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - Qty: ${product.quantity} - Batch: ${product.batch} - Location: ${product.location}`);
      });
    } else {
      console.log('No products found in products table');
    }
    
    // Show sample dispatched products
    const [sampleDispatched] = await db.query('SELECT id, product_name, quantity, batch, location, party_name FROM dispatchProduct LIMIT 5');
    console.log('\n🚚 Sample dispatched products:');
    if (sampleDispatched.length > 0) {
      sampleDispatched.forEach((product, index) => {
        console.log(`${index + 1}. ${product.product_name} - Qty: ${product.quantity} - Batch: ${product.batch} - Location: ${product.location}`);
      });
    } else {
      console.log('No dispatched products found in dispatchProduct table');
    }
    
  } catch (error) {
    console.error('❌ Error checking data:', error.message);
  } finally {
    process.exit(0);
  }
}

checkData();
