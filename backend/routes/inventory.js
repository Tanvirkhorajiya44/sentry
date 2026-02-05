const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/add', inventoryController.addProduct);
router.post('/dispatch', inventoryController.dispatchProduct);
router.get('/list', inventoryController.listProducts);
router.get('/dispatched', inventoryController.getDispatchedProducts);
router.put('/update/:id', inventoryController.updateProduct);
router.delete('/delete/:id', inventoryController.deleteProduct);

module.exports = router;
