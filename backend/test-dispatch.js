const db = require('./config/db');

async function testDispatch() {
  try {
    console.log('Testing dispatch functionality...');
    
    // First, let's see what products are available
    const [products] = await db.query('SELECT id, name, quantity, batch, location, party FROM products WHERE quantity > 0');
    console.log('\n📦 Available products for dispatch:');
    if (products.length > 0) {
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - Qty: ${product.quantity} - Batch: ${product.batch} - Location: ${product.location}`);
      });
      
      // Test dispatch with the first product
      const testProduct = products[0];
      console.log(`\n🚚 Testing dispatch with: ${testProduct.name}`);
      
      const testData = {
        itemName: testProduct.name,
        quantity: 5,
        rate: 100,
        date: '2024-01-15',
        batch: testProduct.batch,
        location: testProduct.location,
        party: 'Test Customer'
      };
      
      console.log('Test dispatch data:', testData);
      
      // Check if stock exists for this product
      const [stockRows] = await db.query(
        'SELECT s.id, s.quantity, s.product_id FROM stock s JOIN products p ON s.product_id = p.id WHERE p.name = ? AND s.batch = ? AND s.location = ?',
        [testData.itemName, testData.batch, testData.location]
      );
      
      console.log(`Stock found: ${stockRows.length} records`);
      if (stockRows.length > 0) {
        console.log(`Available stock: ${stockRows[0].quantity}`);
      } else {
        console.log('❌ No stock found for this product - this might be why dispatch fails');
      }
      
    } else {
      console.log('❌ No products available for dispatch');
    }
    
  } catch (error) {
    console.error('❌ Error testing dispatch:', error.message);
  } finally {
    process.exit(0);
  }
}

testDispatch();
