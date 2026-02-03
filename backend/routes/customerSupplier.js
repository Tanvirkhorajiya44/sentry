const express = require('express');
const router = express.Router();
const csController = require('../controllers/customerSupplierController');

router.post('/customer/add', csController.addCustomer);
router.get('/customer/list', csController.listCustomers);
router.post('/supplier/add', csController.addSupplier);
router.get('/supplier/list', csController.listSuppliers);

module.exports = router;
