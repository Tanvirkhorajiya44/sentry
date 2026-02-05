const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/list', stockController.listStock);
router.post('/add', stockController.addStock);
router.put('/update/:id', stockController.updateStock);
router.delete('/delete/:id', stockController.deleteStock);

module.exports = router;
